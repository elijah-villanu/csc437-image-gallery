import express, {Request,Response, NextFunction} from "express";
import { CredProvider } from "../CredProvider"
import jwt from "jsonwebtoken";

export interface IAuthTokenPayload {
    username: string;
}

function generateAuthToken(username: string, jwtSecret: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const payload: IAuthTokenPayload = {
            username
        };
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}


export function registerAuthRoutes(app: express.Application, credProvider: CredProvider) {
    app.post("/auth/register", (req, res) => {


        async function createUser() {
            const data = req.body;
            if (data.username && data.password) {
                const result = await credProvider.registerUser(data.username, data.password);

                // result returns true if found and created, false if user already exists
                if (result) {
                    const token = await generateAuthToken(data.username,req.app.locals.JWT_SECRET)
                    res.status(201).send(token)
                } else {
                    res.status(409).send("Username already taken")
                }
            } else {
                res.status(400).send({
                    error: "Bad request",
                    message: "Missing username or password"
                });
            }

        }

        createUser();

    });

    app.post("/auth/login", (req, res) => {
        const data = req.body;
        if(data.username === "" || data.password === ""){
            res.status(400).send("Please enter username and password")
            return;
        }

        async function login() {
            const verified = await credProvider.verifyPassword(data.username, data.password)
            if (verified){
                const token = await generateAuthToken(data.username,req.app.locals.JWT_SECRET)
                res.send(token)

            } else res.status(401).send("Incorrect Username or password")
        }

        login();

    })


}


