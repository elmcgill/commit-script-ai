import { Request, Response } from "express";
import { IAuthenticationService, ICodeService, IGithubService } from "../services/types.services";
import { IGithubController } from "./types.controllers";
import { GithubPullRequestDTO, GithubRepositoryDTO } from "../types/github.types";

export default function GithubController(authenticationService: IAuthenticationService, githubService:IGithubService, codeService:ICodeService): IGithubController {

    const getAllUserRepositories = async (req: Request, res: Response) => {
        try {
            const token = req.cookies.token;
            const user = await authenticationService.decodeUser(token);
            const repositories = await githubService.fetchAllUsersRespositories(user);
            res.status(200).json({message: "Hitting the repositories route", repositories});
        } catch (e) {
            console.error(e);
            res.status(400).json({ message: "Bad request", error: e });
        }
    }

    const getAllRepositoryPullRequests = async (req:Request, res:Response) => {
        try {
            const token = req.cookies.token;
            const repository = req.body as GithubRepositoryDTO;

            const user = await authenticationService.decodeUser(token);

            const pullRequests = await githubService.fetchRepositoryPullRequests(user, repository);

            res.status(200).json({pullRequests});

        } catch(e){
            res.status(400).json({message: "Bad request", error: e});
        }
    }

    const getPullRequestDiff = async (req:Request, res:Response) => {
        try {
            const token = req.cookies.token;
            const pullRequest = req.body as GithubPullRequestDTO;

            const user = await authenticationService.decodeUser(token);

            //const diffText = await githubService.fetchPullRequestDiff(user, pullRequest);
            const diff = await codeService.processGitDiff(user, pullRequest);

            res.status(200).json({proccessedDiff: diff});
        } catch(e){
            res.status(400).json({message: "Bad request", error: e});
        }
    }

    return {
        getAllUserRepositories,
        getAllRepositoryPullRequests,
        getPullRequestDiff
    }

}
