import { Result } from '@xofttion/utils';
import { MiddlewareToken } from './middleware.type';

export type ControllerConfig = {
  basePath: string;
  middlewares: MiddlewareToken[];
};

export type ResultInvalid<T = unknown> = {
  data: T;
  statusCode: number;
};

export type ResultServer<T = unknown> = Result<ResultInvalid | unknown, T>;
