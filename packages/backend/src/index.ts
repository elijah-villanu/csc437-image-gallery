import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;

const app = express();

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
