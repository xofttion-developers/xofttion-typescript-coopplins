import { Either } from '@xofttion/utils';

export type ControllerConfig = {
  basePath: string;
  middlewares: Function[];
};

type ControllerResponseLeft = {
  data: any;
  statusCode: number;
};

export type ControllerResponse<T = unknown> = Either<ControllerResponseLeft, T>;
