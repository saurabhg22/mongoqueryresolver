
import find from './find';
import { MongoClient, Db } from 'mongodb';
import Filter from './filter';

let db: Db;

export const init = async (mongoUri: string): Promise<Db> => {
    db = await new Promise<Db>((resolve, reject) => {
        MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) return reject(err);
            return resolve(client.db());
        });
    });
    return db;
}

export const filter = async (filter:Filter) => {
    return find(db, filter);
}




