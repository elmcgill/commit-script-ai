import AuthenticationRoutes from "./authentication.routes";
import { ControllersModule } from "../controllers/controller.types";
import { Router, Express } from "express";

export function registerRoutes(app:Express, controllers: ControllersModule) {
   
    const router = Router();

    const authenticationRoutes = AuthenticationRoutes(router, controllers.AuthenticationController);

    app.use("/auth", authenticationRoutes);

}
