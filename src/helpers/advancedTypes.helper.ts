import {mapper} from "./advancedTypesMapper.helper";
import {mapper as basicMapper} from './basicTypesMapper.helper'

const getClosingTagIndex=(str:string, startIndex:number)=>{
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

    return index-1;
}

export const removeFrozen = (str: string): string => {
    const frozenIndex = str.indexOf('frozen<') + 7;

    if (frozenIndex === 6) {
        return str;
    }

    const index=getClosingTagIndex(str,frozenIndex)

    return removeFrozen(
        str.slice(0, frozenIndex - 7)
            .concat(str.slice(frozenIndex, index))
            .concat(str.slice(index+1, str.length))
    );
}

const getType = (str:string) => {
    const openTagIndex = str.indexOf('<') + 1;

    if (openTagIndex === 0) {
        return {type: str, string: ''};
    }

    return {
        type: str.slice(0, openTagIndex - 1),
        string: str.slice(openTagIndex, getClosingTagIndex(str, openTagIndex))
    };
}

export const getSchema = (str:string):object => {
    const complexType = getType(str);

    if (complexType.string === '') {
        return {type:'text',...basicMapper[complexType.type]}
    }

    if (complexType.type === 'tuple') {
        return {
            ...mapper[complexType.type],
            items: complexType.string.split(', ').map(getSchema)
        }
    }

    if (complexType.type === 'map') {
        return {
            ...mapper[complexType.type],
            items: {
                type:'array',
                items:complexType.string.split(', ').map(getSchema)
            }
        }
    }

    return {
        ...mapper[complexType.type],
        items: getSchema(complexType.string)
    }
}