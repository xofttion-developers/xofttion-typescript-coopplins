import { MiddlewareType } from './middleware.type';

export type RouteHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type RouteConfig = {
  key: string | symbol;
  http: RouteHttp;
  middlewares: MiddlewareType[];
  path: string;
};
