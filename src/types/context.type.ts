import { Context } from '@xofttion/dependency-injection';

const KEY = 'copplinsContext';

export function fetchContext(request: any): Undefined<Context> {
  return request[KEY] instanceof Context ? request[KEY] : undefined;
}

export function saveContext(request: any, context: Context): void {
  request[KEY] = context;
}

export function proxyContext(request: any): Context {
  const current = fetchContext(request);

  if (current) {
    return current;
  }

  const context = new Context();

  saveContext(request, context);

  return context;
}
