import { MiddlewareToken } from './middleware.type';

export type ControllerConfig = {
  basePath: string;
  middlewares: MiddlewareToken[];
};
