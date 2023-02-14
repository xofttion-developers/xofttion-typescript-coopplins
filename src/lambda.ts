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

export function registerLambdas(config: Config): void {
  const { collection, error, server } = config;

  for (const ref of collection) {
    lambdas.get(ref).present((lambdaConfig) => {
      const { http, middlewares, path } = lambdaConfig;

      const router = express.Router();

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
    const scope = getContext(request);

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

function getContext(request: Request): ScopeType | undefined {
  const context = (request as any)['context'];

  return context instanceof Map ? context : undefined;
}
