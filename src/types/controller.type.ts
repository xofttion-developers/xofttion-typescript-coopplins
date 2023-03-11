import { Either } from '@xofttion/utils';
import { MiddlewareToken } from './middleware.type';

export type ControllerConfig = {
  basePath: string;
  middlewares: MiddlewareToken[];
};

export type ResultInvalid = {
  data: any;
  statusCode: number;
};

export type Result<T = unknown> = Either<ResultInvalid, T>;
