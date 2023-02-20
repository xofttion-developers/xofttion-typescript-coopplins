import { ScopeStore } from '@xofttion/dependency-injection';

export const SCOPE_KEY = 'scope';

export function getRequestScope(request: any): ScopeStore | undefined {
  return request[SCOPE_KEY] instanceof ScopeStore ? request[SCOPE_KEY] : undefined;
}
