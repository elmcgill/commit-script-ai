import AuthenticationController from "./authentication.controller";
import { ControllersModule } from "./controller.types";

export default function registerControllers():ControllersModule{
   
    const authenticationController = AuthenticationController();

    return {
        AuthenticationController: authenticationController
    };

}
