import express, { Request, Response,NextFunction } from "express";
import { ValidRoutes } from "./shared/ValidRoutes";
import dotenv from "dotenv";
import { connectMongo } from "./connectMongo";
import { ImageProvider } from "./ImageProvider";
import { registerImageRoutes } from "./routes/imageRoutes";
import { registerAuthRoutes } from "./routes/authRoutes";
import { CredProvider } from "./CredProvider";
import type { IAuthTokenPayload } from "./routes/authRoutes";
import jwt from "jsonwebtoken"


dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const mongoClient = connectMongo(); // Connect to database

const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";
const JWT_SECRET = process.env.JWT_SECRET;
const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || "uploads";

const app = express();

const imageProvider = new ImageProvider(mongoClient);
const credProvider = new CredProvider(mongoClient);

app.locals.JWT_SECRET = JWT_SECRET;

app.use(express.static(STATIC_DIR));
app.use("/uploads", express.static(IMAGE_UPLOAD_DIR))

// Middleware
app.use(express.json()) // for parsing application/json

//Middleware to check for auth headers
declare module "express-serve-static-core" {
    interface Request {
        user?: IAuthTokenPayload // Let TS know what type req.user should be
    }
}

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).end();
    } else { // JWT_SECRET should be read in index.ts and stored in app.locals
        jwt.verify(token, req.app.locals.JWT_SECRET as string, (error, decoded) => {
            if (decoded) {
                req.user = decoded as IAuthTokenPayload; // Modify the request for subsequent handlers
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});


// Maps each value in enum to an endpoint
Object.values(ValidRoutes).forEach((route) => {
    app.get(route, (req: Request, res: Response) => {
        res.sendFile('index.html', { root: '../frontend/dist/' });
    });
});

// Ensures all api endpoints require a JWT
app.use("/api/*", verifyAuthToken);

registerImageRoutes(app, imageProvider)
registerAuthRoutes(app, credProvider)


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
