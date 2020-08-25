import client from "../config";

class KeyspaceRepository {
    static getAll = async () => {
        return (await client.execute('SELECT keyspace_name FROM system_schema.keyspaces')).rows
    }
}

export default KeyspaceRepository