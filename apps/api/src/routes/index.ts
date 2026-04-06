import AuthenticationRoutes from "./authentication.routes";
import { ControllersModule } from "../controllers/types.controllers";
import { Router, Express } from "express";
import GithubRoutes from "./github.routes";

export function registerRoutes(app:Express, controllers: ControllersModule) {
   
    const router = Router();

    const authenticationRoutes = AuthenticationRoutes(router, controllers.AuthenticationController);
    const githubRoutes = GithubRoutes(router, controllers.GithubController);

    app.use("/auth", authenticationRoutes);
    app.use("/github", githubRoutes);

}
