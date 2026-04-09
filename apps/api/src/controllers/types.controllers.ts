import { Request, Response } from 'express';
import { RouteDefinition } from '../routes/types.routes';

export interface ControllersModule {
    AuthenticationController: IAuthenticationController;
    GithubController: IGithubController;
    WalkthroughController: IWalkthroughController;
}

export interface IAuthenticationController {
    authRedirect: (res:Response) => Promise<void>;
    authenticateUser: (req:Request, res:Response) => Promise<void>;
    validateUser: (req:Request, res:Response) => Promise<void>;
    invalidateUser: (req:Request, res:Response) => Promise<void>;
}

export interface IGithubController {
    getAllUserRepositories: (req:Request, res:Response) => Promise<void>;
    getAllRepositoryPullRequests: (req:Request, res:Response) => Promise<void>;
    getPullRequestDiff: (req:Request, res:Response) => Promise<void>;
}

export interface IWalkthroughController {
    generateWalkthroughEpisodes: (req:Request, res:Response) => Promise<void>;
}

export interface Controller {
  basePath: string;
  routes: RouteDefinition[];
}
