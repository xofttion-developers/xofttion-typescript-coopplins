import InjectionFactory from '@xofttion/dependency-injection';
import express, { Express, Request, Response } from 'express';
import {
  createHttpArguments,
  createHttpRoute,
  createMiddlewares,
  createWrap
} from './factories';
import { lambdas } from './stores';

type LambdaType = { [key: string]: Function };
type RouteCallback = (request: Request, response: Response) => Promise<any>;

type Config = {
  collection: Function[];
  error?: (ex: unknown) => void;
  server: Express;
};

type LambdaCallback = {
  lambdaRef: Function;
  error?: (ex: unknown) => void;
};

export function registerLambdas(config: Config): void {
  const { collection, error, server } = config;

  for (const lambdaRef of collection) {
    lambdas.get(lambdaRef).present((lambdaConfig) => {
      const { http, middlewares, path } = lambdaConfig;

      const router = express.Router();

      const lambdaHttp = createHttpRoute(router, http);
      const lambdaMiddlerares = createMiddlewares(middlewares);
      const lambdaCall = createCallback({ lambdaRef, error });

      lambdaHttp(path, [...lambdaMiddlerares, lambdaCall]);

      server.use(path, router);
    });
  }
}

function createCallback(config: LambdaCallback): RouteCallback {
  const { lambdaRef, error } = config;

  return createWrap((request: Request, response: Response) => {
    const lambda = InjectionFactory<LambdaType>(lambdaRef);

    const resolver = lambda['execute'];

    if (!resolver) {
      return Promise.resolve();
    }

    const args = createHttpArguments({
      object: lambda,
      key: 'execute',
      request
    });

    return resolver(...[...args, request, response]);
  }, error);
}