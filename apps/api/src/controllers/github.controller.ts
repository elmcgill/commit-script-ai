import { Request, Response } from "express";
import { IGithubService } from "../services/github";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

dotenv.config();

export interface IGithubController {
    authRedirect: (res: Response) => Promise<void>;
    authUser: (req: Request, res: Response) => Promise<void>;
    decodeUser: (req: Request, res: Response) => Promise<void>;
}

export const GithubController = (service: IGithubService): IGithubController => {

    const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NODE_GITHUB_CLIENT_ID}&scope=repo,user`;
    const JWT_SECRET = process.env.NODE_JWT_SECRET as string ?? '';

    /* Extract this later */
    const createJwt = (user: User) => {
        return jwt.sign(
            user,
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
    }

    const authRedirect = async (res: Response) => {
        console.log("hitting redirect");
        res.redirect(AUTH_URL);
    }

    const authUser = async (req: Request, res: Response) => {
        try {
            console.log("in auth user");
            const { code } = req.query;
            const user = await service.authenticateUser(code as string);
            console.log(user);
            //res.json({ message: 'User authorized', user });
            const token = createJwt(user);
            res.cookie("user", token, {
                httpOnly: true,
                secure: false, //set this to true when we have a https server
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 //1 hour
            })
            res.redirect(`http://localhost:5173`);
        } catch (error: unknown) {
            console.error("Oauth Error:", error.response?.data || error.message);
            res.status(500).json({ error: 'Authentication failed' });
        }
    }

    const decodeUser = async (req: Request, res: Response) => {
        try {
            const token = req.cookies.user;
            if(!token) {
                res.status(401).json({user: null});
                return;
            }
            const decodedUser = jwt.verify(token, JWT_SECRET);
            res.status(200).json({ user: decodedUser })
        } catch (err) {
            console.log("user not present, need to auth them with github")
            res.status(401).json({ user: null });
        }

    }

    return {
        authRedirect,
        authUser,
        decodeUser
    }

}
