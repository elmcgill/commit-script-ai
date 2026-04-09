import AuthenticationRoutes from "./authentication.routes";
import { ControllersModule } from "../controllers/types.controllers";
import { Router, Express } from "express";
import GithubRoutes from "./github.routes";
import WalkthroughRoutes from "./walkthrough.routes";

export function registerRoutes(app:Express, controllers: ControllersModule) {
   
    const router = Router();

    const authenticationRoutes = AuthenticationRoutes(router, controllers.AuthenticationController);
    const githubRoutes = GithubRoutes(router, controllers.GithubController);
    const walkthroughRoutes = WalkthroughRoutes(router, controllers.WalkthroughController);

    app.use("/auth", authenticationRoutes);
    app.use("/github", githubRoutes);
    app.use("/walkthrough", walkthroughRoutes);
}
