import { storeInjectable } from '@xofttion/dependency-injection';
import { middlewares } from '../stores';

export function Middleware(): ClassDecorator {
  return (target) => {
    storeInjectable({ target, singleton: true });
    middlewares.add(target);
  };
}
