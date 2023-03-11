import { Http } from './http.type';
import { MiddlewareToken } from './middleware.type';

export type RouteConfig = {
  key: string | symbol;
  http: Http;
  middlewares: MiddlewareToken[];
  path: string;
};
