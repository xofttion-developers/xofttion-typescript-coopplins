import { Either } from '@xofttion/utils';

export type ControllerConfig = {
  basePath: string;
  middlewares: Function[];
};

export type ResultInvalid = {
  data: any;
  statusCode: number;
};

export type Result<T = unknown> = Either<ResultInvalid, T>;
