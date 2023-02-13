import { createInjectable } from '@xofttion/dependency-injection';
import { controllers } from '../stores';
import { MiddlewareType } from '../types';

export function Controller(
  basePath = '/',
  middlewares: MiddlewareType[] = []
): ClassDecorator {
  return (target) => {
    controllers.add(target, { basePath, middlewares });

    createInjectable({ target, singleton: true });
  };
}
