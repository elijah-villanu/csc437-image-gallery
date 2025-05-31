import express, { Request, Response } from "express";
import { ValidRoutes } from "./shared/ValidRoutes";
import dotenv from "dotenv";
import { connectMongo } from "./connectMongo";
import { ImageProvider } from "./ImageProvider";
import { registerImageRoutes } from "./routes/imageRoutes";


dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const mongoClient = connectMongo(); // Connect to database

const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();

const imageProvider = new ImageProvider(mongoClient);


app.use(express.static(STATIC_DIR));

// Middleware
app.use(express.json()) // for parsing application/json

app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});


// Maps each value in enum to an endpoint
Object.values(ValidRoutes).forEach((route) => {
    app.get(route, (req: Request, res: Response) => {
        res.sendFile('index.html', { root: '../frontend/dist/' });
    });
});


registerImageRoutes(app,imageProvider)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
