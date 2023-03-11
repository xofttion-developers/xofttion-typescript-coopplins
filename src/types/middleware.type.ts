import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { ValidationChain } from 'express-validator';

export type MiddlewareToken = Function | RequestHandler | ValidationChain[];
export type MiddlewareRoute = RequestHandler | ValidationChain[];

export interface OnMiddleware {
  call(request: Request, response: Response, next: NextFunction): any;
}
