import { createInjectable } from '@xofttion/dependency-injection';
import { middlewaresStore } from '../stores';

export function Middleware(): ClassDecorator {
  return (target) => {
    middlewaresStore.add(target);

    createInjectable(target);
  };
}
