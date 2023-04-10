import { Context } from '@xofttion/dependency-injection';

const key = 'contextCooplins';

export function getContext(request: any): Undefined<Context> {
  return request[key] instanceof Context ? request[key] : undefined;
}

export function putContext(request: any, context: Context): void {
  request[key] = context;
}

export function proxyContext(request: any): Context {
  const currentContext = getContext(request);

  if (currentContext) {
    return currentContext;
  }

  const context = new Context();

  putContext(request, context);

  return context;
}
