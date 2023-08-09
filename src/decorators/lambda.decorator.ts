import { registerInjectable } from '@xofttion/dependency-injection';
import { lambdas } from '../stores';
import { Http, LambdaConfig, MiddlewareToken } from '../types';

function createLambda(config: LambdaConfig): ClassDecorator {
  return (token) => {
    lambdas.add(token, config);

    registerInjectable({
      config: {
        scopeable: true,
        singleton: false,
        token
      }
    });
  };
}

export function LambdaPost(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: Http.Post });
}

export function LambdaGet(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: Http.Get });
}

export function LambdaPut(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: Http.Put });
}

export function LambdaDelete(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: Http.Delete });
}

export function LambdaPatch(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: Http.Patch });
}

export function LambdaOptions(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: Http.Options });
}
