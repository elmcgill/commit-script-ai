import { Request, Response } from "express";
import { IAuthenticationService, IWalkthroughService } from "../services/types.services";
import { GithubPullRequestDTO } from "../types/github.types";
import { IWalkthroughController } from "./types.controllers";

export default function WalkthroughController(authenticationService: IAuthenticationService, walkthroughService: IWalkthroughService): IWalkthroughController {

    const generateWalkthroughEpisodes = async (req: Request, res: Response) => {
        try {
            const token = req.cookies.token;
            const pullRequest = req.body as GithubPullRequestDTO;

            const user = await authenticationService.decodeUser(token);

            const walkthrough = await walkthroughService.generateWalkthroughEpisodes(user, pullRequest);
            res.status(200).json({ message: "Generated episodes", episodes: walkthrough });
        } catch (e) {
            res.status(400).json({ message: "Bad Request", error: e });
        }
    }

    return {
        generateWalkthroughEpisodes
    }

}
