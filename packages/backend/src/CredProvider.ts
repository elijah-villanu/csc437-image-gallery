import { Collection, MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async registerUser(username: string, plaintextPassword: string) {
        const exists = await this.collection.findOne({ username: username });
        if (exists) {
            // User already exists
            return false;
        }

        // Salt generation + hash returns a promise
        let salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(plaintextPassword, salt)

        // id auto generated with mongo
        const result = await this.collection.insertOne(
            {
                username: username,
                password: hashedPass
            }
        )
        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        const userDB = await this.collection.findOne({ username: username })

        if (userDB) {
            const hashedDBpass = userDB.password

            console.log(plaintextPassword)
            // Salt is extracted by bcrypt compare
            const verified = await bcrypt.compare(plaintextPassword, hashedDBpass);
            console.log(verified)
            return verified

        } else return false
    }
}
