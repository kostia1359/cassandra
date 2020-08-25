import converterService from "./services/converter.service"
import client from "./config";

(async () => {
    try{
        await client.connect();
        console.log('Connected to cassandra');

        await converterService.createJSON();
    }catch (e){
        console.error(e.message)
    }
})()

