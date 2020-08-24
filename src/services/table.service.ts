import TableRepository from "../repositories/table.repository";

class TableService {
    static getAll = async (keyspace: string) => {
        const tables = await TableRepository.getAll(keyspace);

        return tables
            .filter(row=>row.table_name)
            .map(row=>row.table_name);
    }

    static getBasicSchema = async ({keyspace, table}: { keyspace: string, table: string }) => {
        const schema =await TableRepository.getBasicSchema({keyspace, table});

        return schema
            .filter(row=>row.type)
            .map(row=>row.type);
    }
}

export default TableService;