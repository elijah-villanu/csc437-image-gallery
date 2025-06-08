import { Collection, MongoClient, ObjectId } from "mongodb";
import type { IAuthTokenPayload } from "routes/authRoutes";


interface IImageDocument {
    _id?: ObjectId;
    src: string;
    name: string;
    authorId: string;
}

export class ImageProvider {
    private collection: Collection<IImageDocument>;

    constructor(private readonly mongoClient: MongoClient) {
        const collectionName = process.env.IMAGES_COLLECTION_NAME;
        if (!collectionName) {
            throw new Error("Missing IMAGES_COLLECTION_NAME in .env");
        }
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async createImage(srcEnd: string, userFileName: string, reqUser: IAuthTokenPayload) {
        const username = reqUser.username
        const srcFull = `/uploads/${srcEnd}`
        const result = await this.collection.insertOne(
            {
                src: srcFull,
                name: userFileName,
                authorId: username
            },
        );
        if (result) {
            return true
        } else return false
    }

    async getAllImagesWithAuthors(search?: string) {
        // Query images by name if search string given
        const query: any = {};
        if (search && search.trim().length > 0) {
            query.name = { $regex: search, $options: "i" };
        }

        const images = await this.collection.find(query).toArray();

        // Replace author property with a user document with a fake email
        const result = images.map(img => ({
            ...img,
            author: {
                username: img.authorId,
                email: "fake@email.com"
            }
        }));

        return result;


    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        // Do keep in mind the type of _id in the DB is ObjectId
        const result = await this.collection.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { name: newName } }
        );

        // Is a promise of matchedCount
        return result.matchedCount
    }

    async checkAuthor(reqUser: IAuthTokenPayload, imgId: string) {
        //on image collection
        const result = await this.collection.findOne({ id: imgId })
        if (result) {
            if (result.authorId === reqUser.username) {
                return true
            }
        } else return false
    }

}
