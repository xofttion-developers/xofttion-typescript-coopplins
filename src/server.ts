import InjectableFactory from '@xofttion/dependency-injection';
import { parse } from '@xofttion/utils';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express, NextFunction, Request, Response, Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { DataSource } from 'typeorm';
import { databaseSql } from './database';
import { controllersStore, middlewaresStore, routesStore } from './stores';
import { ControllerConfig, OnMiddleware, RouteConfig } from './types';
import { wrapStandard, wrapTransaction } from './wrap';

type ControllerType = { [key: string | symbol]: Function };
type RouteCallback = (request: Request, response: Response) => Promise<any>;

const server: Express = express();

function _startServer(port: number, call: () => void): void {
  server.use(express.json());
  server.listen(port, call);
}

function _registerControllers(controllers: Function[]): void {
  for (const controllerFn of controllers) {
    const controllerConfig = controllersStore.get(controllerFn);

    if (controllerConfig) {
      const controller = InjectableFactory<ControllerType>(controllerFn);

      const routerController = _createRouterController(controllerConfig);

      const routesConfig = routesStore.get(controllerFn);

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

    if (middlerareCall) {
      routerController.use(middlerareCall);
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
  const call = async (request: Request, response: Response) => {
    const resolver = controller[config.name].bind(controller);

    return await resolver(request, response);
  };

  const production = coopplins.environment<boolean>('PRODUCTION');

  switch (config.wrap) {
    case 'STANDARD':
      return async (request: Request, response: Response) => {
        wrapStandard({ request, response, call, production });
      };

    case 'TRANSACTION':
      return async (request: Request, response: Response) => {
        wrapTransaction({ request, response, call, production });
      };

    default:
      return call;
  }
}

function _createRouteMiddleware(config: RouteConfig): Function[] {
  const routeMiddlerares = [];

  for (const middleware of config.middlewares) {
    const middlerareCall = _createMiddlewareCall(middleware);

    if (middlerareCall) {
      routeMiddlerares.push(middlerareCall);
    }
  }

  return routeMiddlerares;
}

function _createMiddlewareCall(middleware: Function): RequestHandler | undefined {
  if (!middlewaresStore.has(middleware)) {
    return undefined;
  }

  const middlewareCall = InjectableFactory<OnMiddleware>(middleware);

  return async (request: Request, response: Response, next: NextFunction) => {
    return middlewareCall.call(request, response, next);
  };
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

  public database(database: DataSource): void {
    databaseSql.dataSource = database;
  }

  public environment<T>(key: string, options?: Partial<DotenvConfigOptions>): T {
    dotenv.config(options);

    return parse<T>(String(process.env[key]));
  }
}

const coopplins = new Coopplins();

export default coopplins;
