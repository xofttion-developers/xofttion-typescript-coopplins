import { ArgumentsStore } from '../stores';

export function Body(): Function;
export function Body(key?: string): ParameterDecorator {
  return (target, functionKey, index) => {
    ArgumentsStore.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'BODY'
    });
  };
}

export function Header(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    ArgumentsStore.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'HEADER'
    });
  };
}

export function QueryParam(key: string): ParameterDecorator {
  return (target, functionKey, index) => {
    ArgumentsStore.add(target.constructor, {
      functionKey,
      index,
      key,
      type: 'QUERY'
    });
  };
}
