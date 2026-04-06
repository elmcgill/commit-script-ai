import { ServicesModule } from "../services/types.services";
import AuthenticationController from "./authentication.controller";
import { ControllersModule } from "./types.controllers";
import GithubController from "./github.controller";

export default function registerControllers(services:ServicesModule):ControllersModule{
   
    const authenticationController = AuthenticationController(services.AuthenticationService);
    const githubController = GithubController(services.AuthenticationService, services.GithubService);

    return {
        AuthenticationController: authenticationController,
        GithubController: githubController
    };

}
