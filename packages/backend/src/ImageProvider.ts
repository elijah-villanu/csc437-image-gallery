import { Collection, MongoClient, ObjectId } from "mongodb";

interface IImageDocument {
    _id: ObjectId;
    src: string;
    name: string;
    authorId: string; // string
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

    async getAllImagesWithAuthors() {
        const result = await this.collection.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: "$author"
            },
            {

                $project: {
                    _id: 0, // <--- This excludes the original MongoDB _id field
                    id: { $toString: "$_id" }, // this becomes the new "id" field
                    src: 1,
                    name: 1,
                    author: {
                        id: "$author._id",
                        username: "$author.username"
                    }
                }


            }
        ]).toArray();


        return result;
    }
}
