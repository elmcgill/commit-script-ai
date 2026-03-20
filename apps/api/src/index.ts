import express from "express";
import { initDepedencyInjector } from "./config/injectionContainer";
import { UserRoutes } from "./routes/github";

async function bootstrap() {

    const app = express();

    app.use(express.json());

    const { githubController } = await initDepedencyInjector();

    app.use("/auth", UserRoutes(githubController));

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

bootstrap();
