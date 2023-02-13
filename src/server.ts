import { parse } from '@xofttion/utils';
import dotenv, { DotenvConfigOptions } from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { registerControllers } from './controller';
import { registerLambdas } from './lambda';
import { HttpCode } from './types';

type Options = Partial<DotenvConfigOptions>;

type CoopplinsConfig = Partial<{
  afterAll?: () => void;
  beforeAll?: () => Promise<void>;
  controllers?: Function[];
  handleError?: (ex: unknown) => void;
  handlers: RequestHandler[];
  lambdas?: Function[];
}>;

class Coopplins {
  constructor(private config: CoopplinsConfig) {}

  public async start(port: number): Promise<void> {
    const { afterAll, beforeAll, controllers, handlers, handleError, lambdas } =
      this.config;

    const server: Express = express();

    if (beforeAll) {
      await beforeAll();
    }

    if (handlers) {
      for (const handler of handlers) {
        server.use(handler);
      }
    }

    if (controllers) {
      registerControllers({
        collection: controllers,
        error: handleError,
        server
      });
    }

    if (lambdas) {
      registerLambdas({
        collection: lambdas,
        error: handleError,
        server
      });
    }

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
