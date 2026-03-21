import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { initDepedencyInjector } from "./config/injectionContainer";
import { UserRoutes } from "./routes/github";

dotenv.config();

async function bootstrap() {

    const ALLOWED_ORIGINS = process.env.NODE_ALLOWED_ORIGINS?.split(",");
    console.log(ALLOWED_ORIGINS);

    const app = express();
    
    app.use(cors({
        origin: (origin, callback) => {
            if(!origin || ALLOWED_ORIGINS?.includes(origin)){
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    }))
    app.use(cookieParser());
    app.use(express.json());

    const { githubController } = await initDepedencyInjector();

    app.use("/auth", UserRoutes(githubController));

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

bootstrap();
