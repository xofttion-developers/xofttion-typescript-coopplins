import { Either } from '@xofttion/utils';

export type ControllerConfig = {
  basePath: string;
  middlewares: Function[];
};

export type EitherControllerInvalid = {
  data: any;
  statusCode: number;
};

export type EitherController<T = unknown> = Either<EitherControllerInvalid, T>;
