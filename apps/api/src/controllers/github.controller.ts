import { Request, Response } from "express";
import { IGithubService } from "../services/github";
import dotenv from "dotenv";

dotenv.config();

export interface IGithubController {
    authRedirect: (res: Response) => Promise<void>;
    authUser: (req: Request, res:Response) => Promise<void>;
}

export const GithubController = (service: IGithubService): IGithubController => {

    const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NODE_GITHUB_CLIENT_ID}&scope=repo,user`;

    const authRedirect = async (res: Response) => {
        res.redirect(AUTH_URL);
    }

    const authUser = async (req: Request, res: Response) => {
        try {
            const { code } = req.query;
            const user = await service.authenticateUser(code as string);
            res.json({ message: 'User authorized', user });
        } catch (error: unknown) {
            console.error("Oauth Error:", error.response?.data || error.message);
            res.status(500).json({ error: 'Authentication failed' });
        }
    }

    return {
        authRedirect,
        authUser
    }

}
