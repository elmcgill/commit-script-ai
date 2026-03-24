import { Request, Response, NextFunction, Router } from "express";

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => unknown | Promise<unknown>;

export interface RouteDefinition {
  path: string;
  router: Router;
}
