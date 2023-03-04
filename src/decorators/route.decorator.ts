import { routes } from '../stores';
import { Http, MiddlewareType } from '../types';

type HttpConfig = {
  middlewares: MiddlewareType[];
};

const defaultConfig: HttpConfig = {
  middlewares: []
};

function createRoute(http: Http, path: string, config: HttpConfig): MethodDecorator {
  const { middlewares } = config;

  return (target, key) => {
    routes.add(target.constructor, {
      http,
      key,
      middlewares,
      path
    });
  };
}

export function Post(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute(Http.Post, path, { ...defaultConfig, ...config });
}

export function Get(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute(Http.Get, path, { ...defaultConfig, ...config });
}

export function Put(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute(Http.Put, path, { ...defaultConfig, ...config });
}

export function Delete(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute(Http.Delete, path, { ...defaultConfig, ...config });
}

export function Patch(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute(Http.Patch, path, { ...defaultConfig, ...config });
}

export function Options(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute(Http.Options, path, { ...defaultConfig, ...config });
}
