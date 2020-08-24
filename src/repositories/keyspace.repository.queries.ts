export const getKeySpaces = 'SELECT keyspace_name FROM system_schema.keyspaces';

export const getTablesInKeySpace = ({keyspace}: { keyspace: string }) =>
    `SELECT * FROM system_schema.tables WHERE keyspace_name = ${keyspace}`;

export const getTableSchema = ({keyspace, table}: { keyspace: string, table: string }) =>
    `SELECT type FROM system_schema.columns WHERE keyspace_name = ${keyspace} AND table_name =${table}`