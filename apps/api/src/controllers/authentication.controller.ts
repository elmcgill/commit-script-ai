import { Request, Response } from "express";
import { IAuthenticationController } from "./controller.types";
import { IAuthenticationService } from "../services/types.services";

export default function AuthenticationController(authenticationService:IAuthenticationService):IAuthenticationController {

    const authRedirect = async (res: Response) => {
        const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NODE_GITHUB_CLIENT_ID}&scope=repo,user,org`;
        res.redirect(AUTH_URL);
    }

    const authenticateUser = async (req: Request, res:Response) => {
        try{
            const {code} = req.query;
            const user = await authenticationService.authenticate(code as string);
            const token = authenticationService.encodeUser(user);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, //set this to true when we have a https server
                sameSite: "lax",
            })
            res.redirect('http://localhost:5173')
        } catch(e){
            console.error(e);
            res.redirect('http://localhost:5173')
        }
    }

    const validateUser = async (req:Request, res:Response) => {
        try {
            const token = req.cookies.token;
            console.log(token);
            const user = await authenticationService.validate(token);
            console.log(user);
            res.status(200).json({user, message: "User authorized successfully"});
        } catch(e){
            console.error(e);
            res.status(401).json({user: null, message: "User unauthorized"});
        }
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
