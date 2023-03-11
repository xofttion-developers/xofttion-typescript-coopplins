import { createInjectable } from '@xofttion/dependency-injection';
import { middlewares } from '../stores';

export function Middleware(): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: true });
    middlewares.add(target);
  };
}
