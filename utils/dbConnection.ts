import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

let MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI as string
const DB_NAME = process.env.DB_NAME as string
const NODE_ENV = process.env.NODE_ENV as string
let mongoMemoryServer: MongoMemoryServer | null = null;

if (NODE_ENV === 'test') MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable inside .env.local')

class DbConnection {
    private static instance: DbConnection;

    public static async getInstance(): Promise<DbConnection> {
        if (NODE_ENV === 'test') {
            mongoMemoryServer = await MongoMemoryServer.create()
        }
        if (!DbConnection.instance) {
            mongoose.set("strictQuery", false);
            await mongoose.connect(MONGODB_URI, {dbName: DB_NAME}).then(() => console.log('Mongoose connexion successful'), (error) => {
                throw Error(`Error at mongoose connexion : ${error}`)
            });
            DbConnection.instance = new DbConnection()
        }
        return DbConnection.instance
    }

    public async getConnection() {
        return mongoose.connection
    }

    public async closeConnection() {
        if (NODE_ENV === 'test') await mongoose.connection.dropDatabase();
        await mongoose.connection.close()
        if (NODE_ENV === 'test') await (mongoMemoryServer as MongoMemoryServer).stop();
        console.log('Mongoose disconnected')
    }

}

export default DbConnection