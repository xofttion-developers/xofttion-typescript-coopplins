import InjectionFactory from '@xofttion/dependency-injection';
import { Optional, parse } from '@xofttion/utils';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express, NextFunction, Request, Response, Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { args, controllers, middlewares, routes } from './stores';
import {
  ControllerConfig,
  HttpCode,
  MiddlewareType,
  OnMiddleware,
  RouteConfig
} from './types';
import { wrap } from './wrap';

type ControllerType = { [key: string | symbol]: Function };
type Options = Partial<DotenvConfigOptions>;
type RouteCallback = (request: Request, response: Response) => Promise<any>;

type DecoratorConfig = {
  decorators: Function[];
  error?: (ex: unknown) => void;
  server: Express;
};

type CallbackConfig = {
  controller: ControllerType;
  error?: (ex: unknown) => void;
  routeConfig: RouteConfig;
};

type ArgumentsConfig = {
  controller: any;
  key: string | symbol;
  request: Request;
};

function registerDecorators(config: DecoratorConfig): void {
  const { decorators, error, server } = config;

  for (const decorator of decorators) {
    const controllerConfig = controllers.get(decorator);

    if (controllerConfig) {
      const controller = InjectionFactory<ControllerType>(decorator);
      const router = createRouterController(controllerConfig);

      const routesConfig = routes.get(decorator);

      for (const routeConfig of routesConfig) {
        const routeHttp = createRouteHttp(router, routeConfig);

        if (routeHttp) {
          const middlerares = createRouteMiddleware(routeConfig);

          const routeCall = createCallback({ controller, routeConfig, error });

          routeHttp(routeConfig.path, [...middlerares, routeCall]);
        }
      }

      server.use(controllerConfig.basePath, router);
    }
  }
}

function createRouterController(config: ControllerConfig): Router {
  const router = express.Router();
  const { middlewares } = config;

  for (const middleware of middlewares) {
    createMiddleware(middleware).present((call) => {
      router.use(call);
    });
  }

  return router;
}

function createRouteHttp(router: Router, config: RouteConfig): Function {
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

function createCallback(config: CallbackConfig): RouteCallback {
  const { controller, error, routeConfig } = config;
  const { key } = routeConfig;

  return (request: Request, response: Response) => {
    return wrap({
      request,
      response,
      error,
      callback: (request: Request, response: Response) => {
        const resolver = controller[key].bind(controller);

        const baseArgs = createRouteBaseArgs({ controller, key, request });

        const routeArgs = [...baseArgs, request, response];

        return resolver(...routeArgs);
      }
    });
  };
}

function createRouteBaseArgs(config: ArgumentsConfig): any[] {
  const { controller, key, request } = config;

  const argsConfig = args.get(controller.constructor, key);

  const values: any[] = [];

  for (const { key, type } of argsConfig) {
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

function createRouteMiddleware(config: RouteConfig): Function[] {
  const routeMiddlewares: any[] = [];
  const { middlewares } = config;

  for (const middleware of middlewares) {
    createMiddleware(middleware).present((call) => {
      routeMiddlewares.push(call);
    });
  }

  return routeMiddlewares;
}

function createMiddleware(ref: MiddlewareType): Optional<RequestHandler> {
  if (typeof ref === 'object') {
    return Optional.of(ref as unknown as RequestHandler);
  }

  if (middlewares.has(ref as Function)) {
    const middleware = InjectionFactory(ref as Function);

    return isMiddleware(middleware)
      ? Optional.of(
          async (request: Request, response: Response, next: NextFunction) => {
            return middleware.call(request, response, next);
          }
        )
      : Optional.empty();
  }

  return Optional.of(
    async (request: Request, response: Response, next: NextFunction) => {
      return (ref as Function)(request, response, next);
    }
  );
}

function isMiddleware(middleware: any): middleware is OnMiddleware {
  return typeof middleware['call'] === 'function';
}

type CoopplinsConfig = Partial<{
  afterAll?: () => void;
  beforeAll?: () => Promise<void>;
  controllers: Function[];
  handleError?: (ex: unknown) => void;
  handlers: RequestHandler[];
}>;

class Coopplins {
  constructor(private config: CoopplinsConfig) {}

  public async start(port: number): Promise<void> {
    const { afterAll, beforeAll, controllers, handlers, handleError } = this.config;

    const server: Express = express();

    if (beforeAll) {
      await beforeAll();
    }

    if (handlers) {
      for (const handler of handlers) {
        server.use(handler);
      }
    }

    registerDecorators({
      decorators: controllers || [],
      error: handleError,
      server
    });

    try {
      server.listen(port, afterAll);
    } catch (error) {
      console.error(error);
    }
  }
}

export function environment<T = string>(key: string, options?: Options): T {
  dotenv.config(options);

  return parse<T>(String(process.env[key]));
}

export function validator(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): any => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
    } else {
      return res.status(HttpCode.BadRequest).send(errors.array());
    }
  };
}

export function coopplins(config: CoopplinsConfig): Coopplins {
  return new Coopplins(config);
}
