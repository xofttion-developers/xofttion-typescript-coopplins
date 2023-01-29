import { createInjectable } from '@xofttion/dependency-injection';
import { controllers } from '../stores';

export function Controller(
  basePath = '/',
  middlewares: Function[] = []
): ClassDecorator {
  return (target) => {
    controllers.add(target, { basePath, middlewares });

    createInjectable({ target, singleton: true });
  };
}
