import InjectionFactory from '@xofttion/dependency-injection';
import { Optional, parse } from '@xofttion/utils';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express, NextFunction, Request, Response, Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import {
  ArgumentsStore,
  ControllersStore,
  MiddlewaresStore,
  RoutesStore
} from './stores';
import { ControllerConfig, OnMiddleware, RouteConfig } from './types';
import { wrap } from './wrap';

type ControllerType = { [key: string | symbol]: Function };
type RouteCallback = (request: Request, response: Response) => Promise<any>;

type ArgumentsConfig = {
  controller: any;
  functionKey: string | symbol;
  request: Request;
};

const server: Express = express();

function _startServer(port: number, call: () => void): void {
  server.use(express.json());
  server.listen(port, call);
}

function _registerControllers(controllers: Function[]): void {
  for (const controller of controllers) {
    const config = ControllersStore.get(controller);

    if (config) {
      const instance = InjectionFactory<ControllerType>(controller);

      const routerController = _createRouterController(config);

      const routesConfig = RoutesStore.get(controller);

      for (const routeConfig of routesConfig) {
        const routeHttp = _createRouteHttp(routerController, routeConfig);

        if (routeHttp) {
          const middlerares = _createRouteMiddleware(routeConfig);

          const routeCall = _createRouteCall(instance, routeConfig);

          routeHttp(routeConfig.path, [...middlerares, routeCall]);
        }
      }

      server.use(config.basePath, routerController);
    }
  }
}

function _createRouterController(config: ControllerConfig): Router {
  const routerController = express.Router();
  const { middlewares } = config;

  for (const middleware of middlewares) {
    const optional = _createMiddlewareCall(middleware);

    optional.present((call) => {
      routerController.use(call);
    });
  }

  return routerController;
}

function _createRouteHttp(router: Router, config: RouteConfig): Function {
  switch (config.http) {
    case 'POST':
      return router.post.bind(router);
    case 'GET':
      return router.get.bind(router);
    case 'PUT':
      return router.put.bind(router);
    case 'DELETE':
      return router.delete.bind(router);
    case 'PATCH':
      return router.patch.bind(router);
    case 'OPTIONS':
      return router.options.bind(router);
  }
}

function _createRouteCall(
  controller: ControllerType,
  config: RouteConfig
): RouteCallback {
  const { functionKey } = config;

  const call = async (request: Request, response: Response) => {
    const resolver = controller[functionKey].bind(controller);

    const values = _createRouteArguments({ controller, functionKey, request });

    const routeArguments = [...values, request, response];

    return await resolver(...routeArguments);
  };

  const production = Coopplins.environment<boolean>('PRODUCTION');

  return async (request: Request, response: Response) => {
    wrap({ request, response, call, production });
  };
}

function _createRouteArguments(config: ArgumentsConfig): any[] {
  const { controller, functionKey, request } = config;

  const collection = ArgumentsStore.get(controller.constructor, functionKey);

  const values: any[] = [];

  for (const argumentConfig of collection) {
    const { key, type } = argumentConfig;

    switch (type) {
      case 'BODY':
        values.push(key ? request.body[key] : request.body);
        break;
      case 'HEADER':
        values.push(key ? request.headers[key] : undefined);
        break;
      case 'PATH':
        values.push(key ? request.params[key] : undefined);
        break;
      case 'QUERY':
        values.push(key ? request.query[key] : undefined);
        break;
    }
  }

  return values;
}

function _createRouteMiddleware(config: RouteConfig): Function[] {
  const routeMiddlerares: any[] = [];
  const { middlewares } = config;

  for (const middleware of middlewares) {
    const optional = _createMiddlewareCall(middleware);

    optional.present((call) => {
      routeMiddlerares.push(call);
    });
  }

  return routeMiddlerares;
}

function _createMiddlewareCall(middlewareRef: Function): Optional<RequestHandler> {
  if (!MiddlewaresStore.has(middlewareRef)) {
    return Optional.empty();
  }

  const middleware = InjectionFactory<OnMiddleware>(middlewareRef);

  return Optional.of(
    async (request: Request, response: Response, next: NextFunction) => {
      return middleware.call(request, response, next);
    }
  );
}

class CoopplinsServer {
  public controllers(controllers: Function[]): void {
    _registerControllers(controllers);
  }

  public start(port: number, call: () => void): void {
    try {
      _startServer(port, call);
    } catch (error) {
      console.error(error);
    }
  }

  public use(...handlers: RequestHandler[]): void {
    server.use(handlers);
  }

  public environment<T = string>(
    key: string,
    options?: Partial<DotenvConfigOptions>
  ): T {
    dotenv.config(options);

    return parse<T>(String(process.env[key]));
  }
}

export const Coopplins = new CoopplinsServer();
