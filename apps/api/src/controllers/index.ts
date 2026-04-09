import { ServicesModule } from "../services/types.services";
import AuthenticationController from "./authentication.controller";
import { ControllersModule } from "./types.controllers";
import GithubController from "./github.controller";
import WalkthroughController from "./walkthrough.controller";

export default function registerControllers(services: ServicesModule): ControllersModule {

    const authenticationController = AuthenticationController(services.AuthenticationService);
    const githubController = GithubController(services.AuthenticationService, services.GithubService, services.CodeService);
    const walkthroughController = WalkthroughController(services.AuthenticationService, services.WalkthroughService);

    return {
        AuthenticationController: authenticationController,
        GithubController: githubController,
        WalkthroughController: walkthroughController
    };

}
