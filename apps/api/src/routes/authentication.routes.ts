import { Router } from "express";
import { IAuthenticationController } from "../controllers/controller.types";


export default function AuthenticationRoutes(router: Router, controller: IAuthenticationController){

    router.get("/redirect", (_, res) => {
        controller.authRedirect(res);
    });
    router.get("/callback", controller.authenticateUser);
    router.get("/validate", controller.validateUser);
    router.delete("/invalidate", controller.invalidateUser);

    return router;
}
