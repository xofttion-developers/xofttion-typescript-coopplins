import { Http } from './http.type';
import { MiddlewareType } from './middleware.type';

export type LambdaConfig = {
  http: Http;
  middlewares: MiddlewareType[];
  path: string;
};
