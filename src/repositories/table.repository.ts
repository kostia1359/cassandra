import client from "../config";

class TableRepository {
    static getAll = async (keyspace: string) => {
        return (await client
                .execute(`SELECT table_name FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`)
        ).rows;
    }

    static getBasicSchema = async ({keyspace, table}: { keyspace: string, table: string }) => {
        return (await client
                .execute(`SELECT type FROM system_schema.columns WHERE keyspace_name = '${keyspace}' AND table_name = '${table}'`)
        ).rows
    }
}

export default TableRepository;