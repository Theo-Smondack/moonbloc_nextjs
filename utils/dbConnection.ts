import mongoose, {Mongoose} from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

class DbConnection {
    private static instance: DbConnection
    private constructor() {
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODB_URI, {dbName: "MoonBlocDB"}).then((mongoose: Mongoose) => {
                console.log('Mongoose connexion successful')
                return mongoose
            }
            , (error) => {
                throw Error(`Error at mongoose connexion : ${error}`)
            })
    }

    public static async getInstance(): Promise<DbConnection> {
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection()
        }
        return DbConnection.instance
    }
}

export default DbConnection