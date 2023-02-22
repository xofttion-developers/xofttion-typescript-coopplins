import InjectionFactory from '@xofttion/dependency-injection';
import { Request } from 'express';
import { args } from '../stores';
import { ArgumentsType, getRequestScope } from '../types';

type ArgumentConfig = {
  object: any;
  key: string | symbol;
  request: Request;
};

export function createHttpArguments(config: ArgumentConfig): any[] {
  const { object, key, request } = config;

  const argsConfig = args.get(object.constructor, key);

  const values: any[] = [];

  for (const { key, type, target } of argsConfig) {
    switch (type) {
      case ArgumentsType.Body:
        values.push(key ? request.body[key] : request.body);
        break;
      case ArgumentsType.Header:
        values.push(key ? request.headers[key] : undefined);
        break;
      case ArgumentsType.Path:
        values.push(key ? request.params[key] : undefined);
        break;
      case ArgumentsType.Query:
        values.push(key ? request.query[key] : undefined);
        break;
      case ArgumentsType.Object:
        if (target) {
          const scope = getRequestScope(request);
          const interactor = InjectionFactory({ ref: target, scope });

          values.push(interactor);
        } else {
          values.push(undefined);
        }
        break;
    }
  }

  return values;
}
