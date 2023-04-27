import { storeInjectable } from '@xofttion/dependency-injection';
import { controllers } from '../stores';
import { MiddlewareToken } from '../types';

export function Controller(
  basePath = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return (target) => {
    controllers.add(target, { basePath, middlewares });

    storeInjectable({ target, singleton: true });
  };
}
