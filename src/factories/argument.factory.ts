import factoryInject from '@xofttion/dependency-injection';
import { parseBoolean } from '@xofttion/utils';
import { Request } from 'express';
import { args } from '../stores';
import { ArgumentsDataType, ArgumentsType, fetchContext } from '../types';

type ArgumentConfig = {
  key: string | symbol;
  object: any;
  request: Request;
};

export function createHttpArguments(config: ArgumentConfig): any[] {
  const {
    key,
    object: { constructor },
    request
  } = config;

  const argsConfig = args.fetch(constructor, key);

  const values: any[] = [];

  for (const { dataType, key, type, token } of argsConfig) {
    switch (type) {
      case ArgumentsType.Body:
        values.push(key ? request.body[key] : request.body);
        break;
      case ArgumentsType.Header:
        values.push(
          key ? getArgumentValue(request.headers[key], dataType) : undefined
        );
        break;
      case ArgumentsType.Path:
        values.push(
          key ? getArgumentValue(request.params[key], dataType) : undefined
        );
        break;
      case ArgumentsType.Query:
        values.push(
          key ? getArgumentValue(request.query[key], dataType) : undefined
        );
        break;
      case ArgumentsType.Inject:
        values.push(
          token
            ? factoryInject({ config: { token, context: fetchContext(request) } })
            : undefined
        );
        break;
    }
  }

  return values;
}

function getArgumentValue(value: any, dataType?: ArgumentsDataType): any {
  if (!value || !dataType) {
    return value;
  }

  switch (dataType) {
    case 'number':
      return new Number(value);
    case 'boolean':
      return parseBoolean(value);
    default:
      return value;
  }
}
