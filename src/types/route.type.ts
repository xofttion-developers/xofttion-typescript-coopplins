export type RouteHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type RouteConfig = {
  http: RouteHttp;
  name: string | symbol;
  middlewares: Function[];
  path: string;
};
