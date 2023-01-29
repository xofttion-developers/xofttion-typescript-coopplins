import { createInjectable } from '@xofttion/dependency-injection';
import { middlewares } from '../stores';

export function Middleware(): ClassDecorator {
  return (target) => {
    middlewares.add(target);

    createInjectable({ target, singleton: true });
  };
}
