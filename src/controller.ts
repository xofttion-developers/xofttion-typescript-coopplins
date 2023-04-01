import factoryInjectable from '@xofttion/dependency-injection';
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
  error?: (ex: unknown) => void;
  server: Express;
};

type ControllerCallback = {
  controller: ControllerType;
  error?: (ex: unknown) => void;
  key: string | symbol;
};

export function registerControllers({ collection, error, server }: Config): void {
  for (const token of collection) {
    controllers.get(token).present(({ basePath, middlewares }) => {
      const controller = factoryInjectable<ControllerType>({ token });
      const router = createRouterController(middlewares);

      const routesConfig = routes.get(token);

      for (const config of routesConfig) {
        const { http, middlewares, key, path } = config;

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
