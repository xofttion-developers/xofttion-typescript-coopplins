import InjectionFactory, { ScopeType } from '@xofttion/dependency-injection';
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
  ref: Function;
  error?: (ex: unknown) => void;
};

export const SCOPE_KEY = 'scope';

export function registerLambdas(config: Config): void {
  const { collection, error, server } = config;

  for (const ref of collection) {
    lambdas.get(ref).present((lambdaConfig) => {
      const { http, middlewares, path } = lambdaConfig;

      const router = express.Router({ mergeParams: true });

      const lambdaHttp = createHttpRoute(router, http);
      const lambdaMiddlerares = createMiddlewares(middlewares);
      const lambdaCall = createCallback({ ref, error });

      lambdaHttp('/', [...lambdaMiddlerares, lambdaCall]);

      server.use(path, router);
    });
  }
}

function createCallback(config: LambdaCallback): RouteCallback {
  const { ref, error } = config;

  return createWrap((request: Request, response: Response) => {
    const scope = getRequestScope(request);

    const lambda = InjectionFactory<LambdaType>({ ref, scope });

    if (typeof lambda['execute'] !== 'function') {
      return Promise.resolve();
    }

    const resolver = lambda['execute'].bind(lambda);

    const args = createHttpArguments({
      object: lambda,
      key: 'execute',
      request
    });

    return resolver(...[...args, request, response]);
  }, error);
}

function getRequestScope(request: Request): ScopeType | undefined {
  const scope = (request as any)[SCOPE_KEY];

  return scope instanceof Map ? scope : undefined;
}
