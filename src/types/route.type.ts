import { Http } from './http.type';
import { MiddlewareToken } from './middleware.type';

export type RouteConfig = {
  http: Http;
  key: string | symbol;
  middlewares: MiddlewareToken[];
  path: string;
};
