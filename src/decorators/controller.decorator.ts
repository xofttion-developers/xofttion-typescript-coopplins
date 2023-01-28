import { createInjectable } from '@xofttion/dependency-injection';
import { controllersStore } from '../stores';

export function Controller(
  basePath = '/',
  middlewares: Function[] = []
): ClassDecorator {
  return (target) => {
    controllersStore.add(target, { basePath, middlewares });

    createInjectable({ target, singleton: true });
  };
}
