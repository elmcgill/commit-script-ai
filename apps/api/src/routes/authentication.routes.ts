import { Router } from "express";
import { IAuthenticationController } from "../controllers/types.controllers";


export default function AuthenticationRoutes(router: Router, controller: IAuthenticationController){

    router.get("/", (_, res) => {
        controller.authRedirect(res);
    });
    router.get("/callback", controller.authenticateUser);
    router.get("/validate", controller.validateUser);
    router.delete("/invalidate", controller.invalidateUser);

    return router;
}
