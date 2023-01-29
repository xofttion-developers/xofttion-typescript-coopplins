import { args } from '../stores';

export function Body(key?: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'BODY'
    });
  };
}

export function Header(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'HEADER'
    });
  };
}

export function PathParam(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'PATH'
    });
  };
}

export function QueryParam(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    args.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'QUERY'
    });
  };
}
