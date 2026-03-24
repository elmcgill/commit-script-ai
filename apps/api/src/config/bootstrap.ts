import express,{ Express } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { sequelize } from './database';
import registerControllers from '../controllers';
import { registerRoutes } from '../routes';

/* Bootstrap application and perform dependency injection */
export async function bootstrap(app: Express) {
    
    dotenv.config();
    const ALLOWED_ORIGINS = process.env.NODE_ALLOWED_ORIGINS?.split(",");
    const RESET_DATABASE_ON_STARTUP = process.env.NODE_REFRESH_DATABASE == null ? 
        false : process.env.NODE_REFRESH_DATABASE === 'true';
    
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || ALLOWED_ORIGINS?.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    }))
    
    app.use(cookieParser());
    app.use(express.json());

    await sequelize.authenticate();
    /*
    const schema = generateSchema(sequelize);
    */
    await sequelize.sync({force: RESET_DATABASE_ON_STARTUP});

    /* Create Repositories for DI */

    /* Create Services for DI */

    /* Create Controllers for DI */
    const controllers = registerControllers();

    /* Map server routes */
    registerRoutes(app, controllers);
}
