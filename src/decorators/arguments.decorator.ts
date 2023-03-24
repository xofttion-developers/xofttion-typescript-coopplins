import { InjectableToken } from '@xofttion/dependency-injection';
import { args } from '../stores';
import { ArgumentsDataType as DataType, ArgumentsType } from '../types';

type Decorator = ParameterDecorator;

type Config = {
  type: ArgumentsType;
  key?: string;
  dataType?: DataType;
};

function createParameter({ type, key, dataType }: Config): Decorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      dataType: dataType || 'string',
      index,
      key,
      token,
      type
    });
  };
}

export function Provide(provide: InjectableToken): Decorator {
  return (target, token, index) => {
    args.add(target.constructor, {
      index,
      target: provide,
      token,
      type: ArgumentsType.Provide
    });
  };
}

export function Body(key?: string): Decorator {
  return createParameter({ type: ArgumentsType.Body, key });
}

export function Header(key: string, dataType?: DataType): Decorator {
  return createParameter({ type: ArgumentsType.Header, dataType, key });
}

export function HeaderBool(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Header, dataType: 'boolean', key });
}

export function HeaderNumber(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Header, dataType: 'number', key });
}

export function PathParam(key: string, dataType?: DataType): Decorator {
  return createParameter({ type: ArgumentsType.Path, dataType, key });
}

export function PathParamBool(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Path, dataType: 'boolean', key });
}

export function PathParamNumber(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Path, dataType: 'number', key });
}

export function QueryParam(key: string, dataType?: DataType): Decorator {
  return createParameter({ type: ArgumentsType.Query, dataType, key });
}

export function QueryParamBool(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Query, dataType: 'boolean', key });
}

export function QueryParamNumber(key: string): Decorator {
  return createParameter({ type: ArgumentsType.Query, dataType: 'number', key });
}
