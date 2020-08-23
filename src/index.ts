import client from "./config";

(async ()=>{
    const keySpaces=(await client.execute('SELECT keyspace_name FROM system_schema.keyspaces')).rows
        .filter(row=>typeof row.keyspace_name==='string' && !row.keyspace_name.startsWith('system'))
        .map(row=>row.keyspace_name);

    console.log(keySpaces)
})()
