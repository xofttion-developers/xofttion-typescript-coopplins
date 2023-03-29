import warehouse from '@xofttion/dependency-injection';
import { parseBoolean } from '@xofttion/utils';
import { Request } from 'express';
import { args } from '../stores';
import { ArgumentsDataType, ArgumentsType, getWorkspaceRequest } from '../types';

type ArgumentConfig = {
  object: any;
  key: string | symbol;
  request: Request;
};

export function createHttpArguments(config: ArgumentConfig): any[] {
  const { key, object, request } = config;

  const argsConfig = args.get(object.constructor, key);

  const values: any[] = [];

  for (const { dataType, key, type, target: token } of argsConfig) {
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
        const workspace = getWorkspaceRequest(request);

        values.push(token ? warehouse({ token, workspace }) : undefined);
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
