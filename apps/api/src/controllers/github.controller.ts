import { Request, Response } from "express";
import { IAuthenticationService, IGithubService } from "../services/types.services";
import { IGithubController } from "./types.controllers";

export default function GithubController(authenticationService: IAuthenticationService, githubService:IGithubService): IGithubController {

    const getAllUserRepositories = async (req: Request, res: Response) => {
        try {
            const token = req.cookies.token;
            const user = await authenticationService.decodeUser(token);
            const repositories = await githubService.fetchAllUsersRespositories(user);
            res.status(200).json({message: "Hitting the repositories route", repositories});
        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Bad request" });
        }
    }

    return {
        getAllUserRepositories
    }

}
