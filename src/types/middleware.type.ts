import { NextFunction, Request, Response } from 'express';
import { ValidationChain } from 'express-validator';

export type MiddlewareType = Function | ValidationChain[];

export interface OnMiddleware {
  call(request: Request, response: Response, next: NextFunction): any;
}
