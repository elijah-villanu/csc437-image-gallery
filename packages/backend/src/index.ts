import express, { Request, Response } from "express";
import { ValidRoutes } from "./shared/ValidRoutes";
import dotenv from "dotenv";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const STATIC_DIR = process.env.STATIC_DIR || "public";

const app = express();

app.use(express.static(STATIC_DIR));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// Maps each value in enum to an endpoint

Object.values(ValidRoutes).forEach((route) =>{
    app.get(Object.values(ValidRoutes), (req: Request, res: Response) => {
        res.sendFile('index.html', {root: '../frontend/dist/'})
    });

});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
