import { Request, Response } from 'express';
import { RouteDefinition } from '../routes/types.routes';

export interface ControllersModule {
    AuthenticationController: IAuthenticationController;
}

export interface IAuthenticationController {
    authRedirect: (res:Response) => Promise<void>;
    authenticateUser: (req:Request, res:Response) => Promise<void>;
    validateUser: (req:Request, res:Response) => Promise<void>;
    invalidateUser: (req:Request, res:Response) => Promise<void>;
}

export interface Controller {
  basePath: string;
  routes: RouteDefinition[];
}
