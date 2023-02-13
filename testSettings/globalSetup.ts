import {config} from './testConfig.json'

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {loadEnvConfig} from "@next/env";

export default async function globalSetup() {
    const projectDir = process.cwd()
    loadEnvConfig(projectDir)

    if (config.Memory) {
        // Config to decided if an mongodb-memory-server instance should be used
        // it's needed in global space, because we don't want to create a new instance every testSettings-suite
        const instance = await MongoMemoryServer.create();
        const uri = instance.getUri();
        (global as any).__MONGOINSTANCE = instance;
        process.env.MONGODB_URI = uri.slice(0, uri.lastIndexOf('/'));
    } else {
        process.env.MONGODB_URI = `mongodb://${config.IP}:${config.Port}`;
    }

    // The following is to make sure the database is clean before an testSettings starts
    await mongoose.set("strictQuery", true);
    await mongoose.connect(`${process.env.MONGODB_URI}/${config.Database}`);
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
};
