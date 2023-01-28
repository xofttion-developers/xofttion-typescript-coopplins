import { routesStore } from '../stores';
import { RouteHttp } from '../types';

type HttpConfig = {
  middlewares: Function[];
};

const defaultConfig: HttpConfig = {
  middlewares: []
};

function createRoute(
  http: RouteHttp,
  path: string,
  config: HttpConfig
): MethodDecorator {
  const { middlewares } = config;

  return (target, name) => {
    routesStore.add(target.constructor, {
      http,
      key: name,
      middlewares,
      path
    });
  };
}

export function Post(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute('POST', path, { ...defaultConfig, ...config });
}

export function Get(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute('GET', path, { ...defaultConfig, ...config });
}

export function Put(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute('PUT', path, { ...defaultConfig, ...config });
}

export function Delete(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute('DELETE', path, { ...defaultConfig, ...config });
}

export function Patch(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute('PATCH', path, { ...defaultConfig, ...config });
}

export function Options(path = '/', config?: Partial<HttpConfig>): MethodDecorator {
  return createRoute('OPTIONS', path, { ...defaultConfig, ...config });
}
