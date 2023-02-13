import InjectionFactory from '@xofttion/dependency-injection';
import express, { Express, Request, Response, Router } from 'express';
import {
  createHttpArguments,
  createHttpRoute,
  createMiddleware,
  createMiddlewares,
  createWrap
} from './factories';
import { controllers, routes } from './stores';
import { ControllerConfig } from './types';

type ControllerType = { [key: string | symbol]: Function };
type RouteCallback = (request: Request, response: Response) => Promise<any>;

type ControllersConfig = {
  collection: Function[];
  error?: (ex: unknown) => void;
  server: Express;
};

type ControllerCallback = {
  controller: ControllerType;
  error?: (ex: unknown) => void;
  key: string | symbol;
};

export function registerControllers(config: ControllersConfig): void {
  const { collection, error, server } = config;

  for (const ref of collection) {
    controllers.get(ref).present((controllerConfig) => {
      const controller = InjectionFactory<ControllerType>({ ref });
      const router = createRouterController(controllerConfig);

      const routesConfig = routes.get(ref);

      for (const routeConfig of routesConfig) {
        const { http, middlewares, key, path } = routeConfig;

        const routeMiddlewares = createMiddlewares(middlewares);
        const routeHttp = createHttpRoute(router, http);
        const routeCall = createCallback({ controller, key, error });

        routeHttp(path, [...routeMiddlewares, routeCall]);
      }

      server.use(controllerConfig.basePath, router);
    });
  }
}

function createRouterController(config: ControllerConfig): Router {
  const router = express.Router();
  const { middlewares } = config;

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
