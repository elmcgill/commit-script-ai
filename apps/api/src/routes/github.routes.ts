import { Router } from "express";
import { IGithubController } from "../controllers/types.controllers";

export default function GithubRoutes(router: Router, controller: IGithubController){

    router.get("/repositories", controller.getAllUserRepositories); 

    return router;
}
