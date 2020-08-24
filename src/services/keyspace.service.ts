import KeyspaceRepository from "../repositories/keyspace.repository";

class KeyspaceService{
    static getAll=async ()=>{
        const keyspace=await KeyspaceRepository.getAll();

        return keyspace
            .filter(row=>typeof row.keyspace_name==='string' && !row.keyspace_name.startsWith('system'))
            .map(row=>row.keyspace_name);
    }
}

export default KeyspaceService;
