export type RouteHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export type RouteConfig = {
  functionKey: string | symbol;
  http: RouteHttp;
  middlewares: Function[];
  path: string;
};
