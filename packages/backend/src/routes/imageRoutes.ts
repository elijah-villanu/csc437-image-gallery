import express, { Request, Response } from "express";
import { ImageProvider } from "../ImageProvider";
import { ObjectId } from "mongodb";
import { ValidRoutes } from "../shared/ValidRoutes";
import { imageMiddlewareFactory, handleImageFileErrors } from "../imageUploadMiddleware";

const MAX_NAME_LENGTH = 100;

export function registerImageRoutes(app: express.Application, imageProvider: ImageProvider) {
    app.get("/api/images", (req, res) => {
        // Artificially delay response to show loading screen
        function waitDuration(numMs: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, numMs));
        }

        waitDuration(Math.random() * 5000)
            .then(() => imageProvider.getAllImagesWithAuthors())
            .then(images => {
                res.json(images);
            })
    });


    app.get(`/api${ValidRoutes.APISEARCH}`, (req, res) => {
        // Grabs query param from user
        const query = req.query.q;
        if (typeof query !== "string") {
            res.status(400).send({
                error: "Bad Request",
                message: "Details about exactly how the request was malformed"
            });

            //need the return for ts to know its a string
            return;
        }
        //from here ts knows its a string

        imageProvider.getAllImagesWithAuthors(query)
            .then(result => {
                res.json(result)
            });
    });

    // Multer will store files to disk
    app.post(
        "/api/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        (req: Request, res: Response) => {
            // Final handler function after the above two middleware functions finish running
            if (!req.file) {
                res.status(400).send("File Not Found")
                return;
            }
            if (!req.body) {
                res.status(400).send("File Text Not Found")
                return;
            }
            if (req.user) {
                imageProvider.createImage(req.file.filename,req.body.name,req.user)
                    .then((success) => {
                        if(success){
                            res.status(201)
                        } else res.status(400).send("File Upload Failed")
                    })
                
            }
        }
    );

    // Use put for image edits since it is idompotent
    // Needs middleware for body
    app.put("/api/images/:id", express.json(), (req, res) => {
        const imgId = req.params.id
        const newName = req.body.name

        //Check if the user editing photo is the author
        //returns true if author is the requesting user (req.user)
        if (req.user) {
            imageProvider.checkAuthor(req.user, imgId).then((verified) => {
                if (!verified) {
                    res.status(403).send("Unauthorized request")
                    return;
                } else {
                    if (!ObjectId.isValid(imgId)) {
                        res.status(404).send({
                            error: "Not Found",
                            message: "Image does not exist"
                        });
                        return;
                    }

                    if (typeof newName !== "string") {
                        res.status(400).send({
                            error: "Bad Request",
                            message: "Details about exactly how the request was malformed"
                        });
                        return;
                    }

                    // Check if name is less than 100 chars
                    if (newName.length > MAX_NAME_LENGTH) {
                        res.status(422).send({
                            error: "Unprocessable Entity",
                            message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
                        });
                        return;
                    }

                    imageProvider.updateImageName(imgId, newName)
                        .then((count) => {
                            //If none was found
                            if (count === 0) {
                                res.status(404).send({
                                    error: "Not Found",
                                    message: "Image does not exist"
                                });
                            }
                        })
                        .then(() => res.status(204).send("No content"))
                }
            })

        }

    })
}