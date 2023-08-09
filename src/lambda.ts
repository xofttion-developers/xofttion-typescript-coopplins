import factoryInject from '@xofttion/dependency-injection';
import express, { Express, Request, Response } from 'express';
import {
  createHttpArguments,
  createHttpRoute,
  createMiddlewares,
  createWrap
} from './factories';
import { lambdas } from './stores';
import { getContext } from './types';

type RouteCallback = (request: Request, response: Response) => Promise<any>;

type Config = {
  collection: Function[];
  server: Express;
  error?: (error: unknown) => void;
};

type LambdaCallback = {
  token: Function;
  error?: (error: unknown) => void;
};

const key = 'execute';

export function registerLambdas({ collection, error, server }: Config): void {
  for (const ref of collection) {
    lambdas.get(ref).present((config) => {
      const { http, middlewares, path } = config;

      const router = express.Router({ mergeParams: true });

      const httpLambda = createHttpRoute(router, http);
      const middleraresLambda = createMiddlewares(middlewares);
      const callLambda = createCallback({ token: ref, error });

      httpLambda('/', [...middleraresLambda, callLambda]);

      server.use(path, router);
    });
  }
}

function createCallback(config: LambdaCallback): RouteCallback {
  const { token, error } = config;

  return createWrap((request: Request, response: Response) => {
    const object = factoryInject<any>({
      config: { token, context: getContext(request) }
    });

    if (typeof object.execute !== 'function') {
      return Promise.resolve();
    }

    const resolver = object[key].bind(object);

    const args = createHttpArguments({ object, key, request });

    return resolver(...[...args, request, response]);
  }, error);
}
