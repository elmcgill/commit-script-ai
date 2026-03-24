import { Request, Response } from "express";
import { IAuthenticationController } from "./controller.types";

export default function AuthenticationController():IAuthenticationController {

    const authRedirect = async (res: Response) => {
        /*
        const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NODE_GITHUB_CLIENT_ID}&scope=repo,user`;
        res.redirect(AUTH_URL);
        */
        res.json({message: '/auth/redirect mapped properly'})
    }

    const authenticateUser = async (req: Request, res:Response) => {
        res.json({message: "/auth/callback mapped properly"});
    }

    const validateUser = async (req:Request, res:Response) => {
        res.json({message: "/auth/vaidateUser mapped properly"})        
    }

    const invalidateUser = async (req:Request, res: Response) => {
        res.json({message: "/auth/invalidateUser mapped properly"})
    }

    return {
        authRedirect,
        authenticateUser,
        validateUser,
        invalidateUser
    }

}
