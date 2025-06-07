import { Collection, MongoClient, ObjectId } from "mongodb";
import type { IAuthTokenPayload } from "routes/authRoutes";


interface IImageDocument {
    _id: ObjectId;
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

    async getAllImagesWithAuthors(search?: string) {
        const pipeline: any[] = [];

        // Add a match stage only if search string is defined and non-empty
        if (search && search.trim().length > 0) {
            pipeline.push({
                $match: {
                    name: { $regex: search, $options: "i" }  // case-insensitive partial match
                }
            });
        }

        pipeline.push(
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
                    _id: 0,
                    id: { $toString: "$_id" },
                    src: 1,
                    name: 1,
                    author: {
                        id: "$author._id",
                        username: "$author.username"
                    }
                }
            }
        );

        return await this.collection.aggregate(pipeline).toArray();
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

    async checkAuthor(reqUser:IAuthTokenPayload, imgId:string){
        //on image collection
        const result = await this.collection.findOne({id:imgId})
        if(result){
            if(result.authorId === reqUser.username){
                return true
            } 
        } else return false
    }

}
