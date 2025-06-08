import { Request, Response, NextFunction } from "express";
import multer from "multer";

class ImageFormatError extends Error { }

const storageEngine = multer.diskStorage({

    // Determines which directory uploaded files are stored
    destination: function (req, file, cb) {
        const uploadDirectory = process.env.IMAGE_UPLOAD_DIR;
        if (uploadDirectory) {
            cb(null, uploadDirectory);
            return;
        } else {
            cb(new Error("Missing Image Upload Directory"), "")
            return;
        }
    },

    // Set file name in destination directory
    filename: function (req, file, cb) {
        const fileType = file.mimetype
        let fileExt = "";
        switch (fileType) {
            case "image/png":
                fileExt = "png";
                break;
            case "image/jpg":
                fileExt = "jpg";
                break;
            case "image/jpeg":
                fileExt = "jpg";
                break;
            default:
                cb(new ImageFormatError("Unsupported Image Type"), "")
                return;
        }

        // To ensure no file name duplicates exist 
        const fileName = Date.now() + "-" + Math.round(Math.random() * 1E9) + "." + fileExt;
        cb(null, fileName)
        return;
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}