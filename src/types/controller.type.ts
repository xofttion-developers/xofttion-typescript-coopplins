import { Either } from '@xofttion/utils';
import { MiddlewareType } from './middleware.type';

export type ControllerConfig = {
  basePath: string;
  middlewares: MiddlewareType[];
};

export type ResultInvalid = {
  data: any;
  statusCode: number;
};

export type Result<T = unknown> = Either<ResultInvalid, T>;
