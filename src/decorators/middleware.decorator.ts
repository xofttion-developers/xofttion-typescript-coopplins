import { createInjectable } from '@xofttion/dependency-injection/dist/factories';
import { middlewares } from '../stores';

export function Middleware(): ClassDecorator {
  return (target) => {
    createInjectable({ target, singleton: true });
    middlewares.add(target);
  };
}
