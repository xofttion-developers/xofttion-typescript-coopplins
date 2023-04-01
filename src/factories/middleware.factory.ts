import factoryInjectable from '@xofttion/dependency-injection';
import { Optional } from '@xofttion/utils';
import { NextFunction, Request, Response } from 'express';
import { middlewares } from '../stores';
import { MiddlewareRoute, MiddlewareToken, OnMiddleware } from '../types';

export function createMiddlewares(collection: MiddlewareToken[]): MiddlewareRoute[] {
  return collection.reduce((middlewares, middleware) => {
    createMiddleware(middleware).present((call) => middlewares.push(call));

    return middlewares;
  }, [] as MiddlewareRoute[]);
}

export function createMiddleware(token: MiddlewareToken): Optional<MiddlewareRoute> {
  if (typeof token !== 'function') {
    return Optional.of(token);
  }

  if (!middlewares.has(token)) {
    return Optional.of((req: Request, res: Response, next: NextFunction) =>
      token(req, res, next)
    );
  }

  const middleware = factoryInjectable({ token });

  return isMiddleware(middleware)
    ? Optional.of((req: Request, res: Response, next: NextFunction) => {
        return middleware.call(req, res, next);
      })
    : Optional.empty();
}

function isMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['call'] === 'function';
}
