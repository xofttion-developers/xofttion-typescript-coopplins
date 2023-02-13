import InjectionFactory from '@xofttion/dependency-injection';
import { Optional } from '@xofttion/utils';
import { NextFunction, Request, Response } from 'express';
import { middlewares } from '../stores';
import { MiddlewareRoute, MiddlewareType, OnMiddleware } from '../types';

export function createMiddlewares(collection: MiddlewareType[]): MiddlewareRoute[] {
  return collection.reduce((middlewares, middleware) => {
    createMiddleware(middleware).present((call) => middlewares.push(call));

    return middlewares;
  }, [] as MiddlewareRoute[]);
}

export function createMiddleware(ref: MiddlewareType): Optional<MiddlewareRoute> {
  if (typeof ref !== 'function') {
    return Optional.of(ref);
  }

  if (!middlewares.has(ref)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      ref(req, res, next)
    );
  }

  const middleware = InjectionFactory({ ref });

  return isMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.call(req, res, next);
      })
    : Optional.empty();
}

function isMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['call'] === 'function';
}
