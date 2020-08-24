import KeyspaceService from "./services/keyspace.service";
import TableService from "./services/table.service";
import client from "./config";

(async ()=>{
    const keyspace=await KeyspaceService.getAll();
    console.log(keyspace);
    const tables=await TableService.getAll(keyspace[0]);
    console.log(tables);
    console.log(await TableService.getBasicSchema({keyspace:keyspace[0], table:'datatest1'}));
})()
