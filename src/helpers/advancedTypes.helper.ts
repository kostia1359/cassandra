import {mapper} from "./mappers/advancedTypes.mapper";
import {mapper as basicMapper} from './mappers/basicTypes.mapper'
import {IColumnType} from "../types/tableName";

export const getClosingTagIndex = (str: string, startIndex: number) => {
    let unclosedTags = 1;
    let index = startIndex;

    while (unclosedTags) {
        if (str[index] === '<') {
            unclosedTags++;
        }

        if (str[index] === '>') {
            unclosedTags--;
        }
        index++;
    }

    return index - 1;
}

export const removeFrozen = (str: string): string => {
    const frozenIndex = str.indexOf('frozen<') + 7;

    if (frozenIndex === 6) {
        return str;
    }

    const index = getClosingTagIndex(str, frozenIndex)

    return removeFrozen(
        str.slice(0, frozenIndex - 7)
            .concat(str.slice(frozenIndex, index))
            .concat(str.slice(index + 1, str.length))
    );
}

export const getType = (str: string) => {
    const openTagIndex = str.indexOf('<') + 1;

    if (openTagIndex === 0) {
        return {type: str, string: ''};
    }

    return {
        type: str.slice(0, openTagIndex - 1),
        string: str.slice(openTagIndex, getClosingTagIndex(str, openTagIndex))
    };
}

export const getComplexSchema = (str: string): object => {
    const complexType = getType(str);

    if (complexType.string === '') {
        return {type: 'text', ...basicMapper[complexType.type]}
    }

    if (complexType.type === 'tuple') {
        return {
            ...mapper[complexType.type],
            items: complexType.string.split(', ').map(getComplexSchema)
        }
    }

    if (complexType.type === 'map') {
        return {
            ...mapper[complexType.type],
            items: {
                type: 'array',
                items: complexType.string.split(', ').map(getComplexSchema)
            }
        }
    }

    return {
        ...mapper[complexType.type],
        items: getComplexSchema(complexType.string)
    }
}

export const createObjectType = (obj: { [index: string]: any }): object => {
    return {
        type: "object",
        properties: Object.keys(obj).reduce((accum, key) => {
            if (obj[key] === null) {
                return {
                    ...accum, [key]: {
                        type: "null"
                    }
                }
            }

            if (typeof obj[key] === "object" && !Object.keys(obj[key]).length) {
                return {
                    ...accum, [key]: {
                        type: "string"
                    }
                }
            }

            if (typeof obj[key] === "object") {
                return {...accum, [key]: createObjectType(obj[key])}
            }

            return {
                ...accum, [key]: {
                    type: typeof obj[key]
                }
            }
        }, {})
    }
}

export const getSchema = (schema: IColumnType) => {
    if (schema.selectedString && schema.type === 'text') {
        try {
            const object = JSON.parse(schema.selectedString[schema.column]);

            return createObjectType(object);
        } catch (e) {
        }
    }

    const shortenedType = removeFrozen(schema.type);

    if (
        !mapper.hasOwnProperty(shortenedType) && !basicMapper.hasOwnProperty(shortenedType) && schema.selectedString
        && shortenedType.indexOf('<') === -1 && typeof schema.selectedString[schema.column] === 'object'
    ) {
        return createObjectType(schema.selectedString[schema.column]);
    }

    return getComplexSchema(shortenedType);
}
