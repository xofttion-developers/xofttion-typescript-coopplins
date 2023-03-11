import { Http } from './http.type';
import { MiddlewareToken } from './middleware.type';

export type LambdaConfig = {
  http: Http;
  middlewares: MiddlewareToken[];
  path: string;
};
