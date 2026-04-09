import { Router } from "express";
import { IWalkthroughController } from "../controllers/types.controllers";

export default function WalkthroughRoutes(router: Router, controller: IWalkthroughController){

    router.post("/generate", controller.generateWalkthroughEpisodes);

    return router;
}
