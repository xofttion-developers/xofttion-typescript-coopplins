import InjectableFactory from '@xofttion/dependency-injection';
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
import { wrapStandard } from './wrap';

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

function _registerControllers(_controllers: Function[]): void {
  for (const controllerFn of _controllers) {
    const controllerConfig = ControllersStore.get(controllerFn);

    if (controllerConfig) {
      const controller = InjectableFactory<ControllerType>(controllerFn);

      const routerController = _createRouterController(controllerConfig);

      const routesConfig = RoutesStore.get(controllerFn);

      for (const routeConfig of routesConfig) {
        const routeHttp = _createRouteHttp(routerController, routeConfig);

        if (routeHttp) {
          const routeMiddlerares = _createRouteMiddleware(routeConfig);

          const routeCall = _createRouteCall(controller, routeConfig);

          routeHttp(routeConfig.path, [...routeMiddlerares, routeCall]);
        }
      }

      server.use(controllerConfig.basePath, routerController);
    }
  }
}

function _createRouterController(config: ControllerConfig): Router {
  const routerController = express.Router();

  for (const middleware of config.middlewares) {
    const middlerareCall = _createMiddlewareCall(middleware);

    if (middlerareCall.isPresent()) {
      routerController.use(middlerareCall.get());
    }
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

  const production = coopplins.environment<boolean>('PRODUCTION');

  return async (request: Request, response: Response) => {
    wrapStandard({ request, response, call, production });
  };
}

function _createRouteArguments(config: ArgumentsConfig): any[] {
  const { controller, functionKey, request } = config;

  const argumentsCollection = ArgumentsStore.get(controller, functionKey);

  const argumentsValue: any[] = [];

  for (const argumentConfig of argumentsCollection) {
    const { key, type } = argumentConfig;

    switch (type) {
      case 'BODY':
        argumentsValue.push(key ? request.body[key] : request.body);
        break;
      case 'HEADER':
        argumentsValue.push(key ? request.headers[key] : undefined);

        break;
      case 'QUERY':
        argumentsValue.push(key ? request.query[key] : undefined);
        break;
    }
  }

  return argumentsValue;
}

function _createRouteMiddleware(config: RouteConfig): Function[] {
  const routeMiddlerares = [];

  for (const middleware of config.middlewares) {
    const middlerareCall = _createMiddlewareCall(middleware);

    if (middlerareCall.isPresent()) {
      routeMiddlerares.push(middlerareCall.get());
    }
  }

  return routeMiddlerares;
}

function _createMiddlewareCall(middleware: Function): Optional<RequestHandler> {
  if (!MiddlewaresStore.has(middleware)) {
    return Optional.empty();
  }

  const middlewareCall = InjectableFactory<OnMiddleware>(middleware);

  return Optional.of(
    async (request: Request, response: Response, next: NextFunction) => {
      return middlewareCall.call(request, response, next);
    }
  );
}

class Coopplins {
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

  public environment<T>(key: string, options?: Partial<DotenvConfigOptions>): T {
    dotenv.config(options);

    return parse<T>(String(process.env[key]));
  }
}

const coopplins = new Coopplins();

export default coopplins;
