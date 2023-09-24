import * as mongoose from 'mongoose';

declare global{
    namespace NodeJS{
        //Types declaration for environment variables
        interface ProcessEnv {
            CMC_API_KEY:string
            MONGODB_URI:string
            NODE_ENV:string
        }
    }
    var mongoose : mongoose;
}

export {}