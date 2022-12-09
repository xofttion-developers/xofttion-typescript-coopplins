import { NextFunction, Request, Response } from 'express';

export interface OnMiddleware {
  call(request: Request, response: Response, next: NextFunction): any;
}
