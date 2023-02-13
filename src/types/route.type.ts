import { Http } from './http.type';
import { MiddlewareType } from './middleware.type';

export type RouteConfig = {
  key: string | symbol;
  http: Http;
  middlewares: MiddlewareType[];
  path: string;
};
