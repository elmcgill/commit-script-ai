import { Router } from "express";
import { IGithubController } from "../controllers/github.controller";

export function UserRoutes(githubController: IGithubController):Router {
    const router = Router();

    router.get("/github", (_, res) => {
        githubController.authRedirect(res);
    })

    router.get("/github/callback", githubController.authUser);
    router.get("/decode", githubController.decodeUser);

    return router;
}
