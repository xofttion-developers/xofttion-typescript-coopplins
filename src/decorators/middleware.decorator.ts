import { createInjectable } from '@xofttion/dependency-injection';
import { MiddlewaresStore } from '../stores';

export function Middleware(): ClassDecorator {
  return (target) => {
    MiddlewaresStore.add(target);

    createInjectable(target);
  };
}
