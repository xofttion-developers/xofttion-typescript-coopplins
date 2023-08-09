import { registerInjectable } from '@xofttion/dependency-injection';
import { middlewares } from '../stores';

export function Middleware(): ClassDecorator {
  return (token) => {
    middlewares.add(token);

    registerInjectable({
      config: {
        scopeable: false,
        singleton: true,
        token
      }
    });
  };
}
