import { ServicesModule } from "../services/types.services";
import AuthenticationController from "./authentication.controller";
import { ControllersModule } from "./controller.types";

export default function registerControllers(services:ServicesModule):ControllersModule{
   
    const authenticationController = AuthenticationController(services.AuthenticationService);

    return {
        AuthenticationController: authenticationController
    };

}
