import { InjectableToken } from '@xofttion/dependency-injection/dist/types';
import { args } from '../stores';
import { ArgumentsType } from '../types';

export function Body(key?: string): ParameterDecorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      token,
      index,
      key,
      type: ArgumentsType.Body
    });
  };
}

export function Header(key: string): ParameterDecorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      token,
      index,
      key,
      type: ArgumentsType.Header
    });
  };
}

export function PathParam(key: string): ParameterDecorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      token,
      index,
      key,
      type: ArgumentsType.Path
    });
  };
}

export function QueryParam(key: string): ParameterDecorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      token,
      index,
      key,
      type: ArgumentsType.Query
    });
  };
}

export function Provide(provide: InjectableToken): ParameterDecorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      target: provide,
      token,
      index,
      type: ArgumentsType.Provide
    });
  };
}
