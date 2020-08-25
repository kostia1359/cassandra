import KeyspaceService from "./keyspace.service";
import TableService from "./table.service";
import fs from 'fs'
import {IColumnType} from "../types/tableName";
import * as typesHelper from "../helpers/advancedTypes.helper"

class ConverterService {
    createJSON = async () => {
        const schemas = (await this.getSchemas()).reduce((accum, schema) => {
            return accum.concat(schema);
        }, []);

        fs.writeFile('src/result.json', JSON.stringify(schemas), err => {
            if (err) {
                console.error(err)
            }
            console.log('done');
        });
    }

    getSchemas = async () => {
        const keySpaces = await KeyspaceService.getAll();

        const schemas = await Promise.all(keySpaces.map(async (keySpace) => await this.getKeyspaceSchemas(keySpace)));

        return schemas;
    }

    getKeyspaceSchemas = async (keyspace: string) => {
        const tables = await TableService.getAll(keyspace);

        const schemas = await Promise.all(tables.map(async (table) => {
            const schema = await TableService.getBasicSchema({keyspace, table});
            return {
                schema: this.convertSchema(schema),
                table: `${keyspace}.${table}`
            }
        }));

        return schemas.map(schema => this.addHeaderSchema(schema));
    }

    addHeaderSchema = ({table, schema}: { table: string, schema: object }) => {
        const header = {
            '$schema': 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            title: `${table}`
        }

        return {...header, properties: schema}
    }

    convertSchema = (schema: IColumnType[]) => {
        return schema.reduce((accum, schema) => {
            if (accum.hasOwnProperty(schema.column)) {
                console.error('Property can not be repetitive ')
                return accum;
            }

            if (schema.selectedString && schema.type === 'text') {
                try {
                    const object = JSON.parse(schema.selectedString[schema.column]);

                    return {...accum, [schema.column]: typesHelper.createObjectType(object)};
                } catch (e) {
                }
            }
            const type = typesHelper.getSchema(typesHelper.removeFrozen(schema.type))

            return {...accum, [schema.column]: type};
        }, {})
    }
}

export default new ConverterService();