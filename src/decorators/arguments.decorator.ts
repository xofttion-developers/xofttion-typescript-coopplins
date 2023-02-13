import { args } from '../stores';
import { ArgumentsType } from '../types';

export function Body(key?: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: ArgumentsType.Body
    });
  };
}

export function Header(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: ArgumentsType.Header
    });
  };
}

export function PathParam(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: ArgumentsType.Path
    });
  };
}

export function QueryParam(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: ArgumentsType.Query
    });
  };
}
