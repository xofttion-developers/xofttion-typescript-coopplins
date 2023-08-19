import factoryInject from '@xofttion/dependency-injection';
import express, { Express, Request, Response, Router } from 'express';
import {
  createHttpArguments,
  createHttpRoute,
  createMiddleware,
  createMiddlewares,
  createWrap
} from './factories';
import { controllers, routes } from './stores';
import { MiddlewareToken } from './types';

type ControllerType = { [key: string | symbol]: Function };
type RouteCallback = (request: Request, response: Response) => Promise<any>;

type Config = {
  collection: Function[];
  server: Express;
  error?: (ex: unknown) => void;
};

type ControllerCallback = {
  controller: ControllerType;
  key: string | symbol;
  error?: (ex: unknown) => void;
};

export function registerControllers({ collection, error, server }: Config): void {
  for (const token of collection) {
    controllers.fetch(token).present(({ basePath, middlewares }) => {
      const controller = factoryInject<ControllerType>({ config: { token } });
      const router = createRouterController(middlewares);

      const configs = routes.fetch(token);

      for (const { http, middlewares, key, path } of configs) {
        const middlewaresRoute = createMiddlewares(middlewares);
        const httpRoute = createHttpRoute(router, http);
        const callRoute = createCallback({ controller, key, error });

        httpRoute(path, [...middlewaresRoute, callRoute]);
      }

      server.use(basePath, router);
    });
  }
}

function createRouterController(middlewares: MiddlewareToken[]): Router {
  const router = express.Router({ mergeParams: true });

  for (const middleware of middlewares) {
    createMiddleware(middleware).present((call) => router.use(call));
  }

  return router;
}

function createCallback(config: ControllerCallback): RouteCallback {
  const { controller, error, key } = config;

  return createWrap((request: Request, response: Response) => {
    const resolver = controller[key].bind(controller);

    const args = createHttpArguments({ object: controller, key, request });

    return resolver(...[...args, request, response]);
  }, error);
}
