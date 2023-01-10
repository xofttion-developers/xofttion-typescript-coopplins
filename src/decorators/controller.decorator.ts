import { createInjectable } from '@xofttion/dependency-injection';
import { ControllersStore } from '../stores';

export function Controller(
  basePath = '/',
  middlewares: Function[] = []
): ClassDecorator {
  return (target) => {
    ControllersStore.add(target, { basePath, middlewares });

    createInjectable({ target, singleton: true });
  };
}
