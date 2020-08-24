import TableRepository from "../repositories/table.repository";
import {IColumnType} from "../types/tableName";

class TableService {
    static getAll = async (keyspace: string):Promise<string[]> => {
        const tables = await TableRepository.getAll(keyspace);

        return tables
            .filter(row=>typeof row.table_name==='string')
            .map(row=>row.table_name);
    }

    static getBasicSchema = async ({keyspace, table}: { keyspace: string, table: string }):Promise<IColumnType[]> => {
        const schema =await TableRepository.getBasicSchema({keyspace, table});

        return schema
            .filter(row=>typeof row.type==='string'&&typeof row.column_name==='string')
            .map(row=>({
                type:row.type,
                column:row.column_name
            }));
    }
}

export default TableService;