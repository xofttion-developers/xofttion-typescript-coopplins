import { NamespaceStore } from '@xofttion/dependency-injection';

export const NAMESPACE_KEY = 'namespace';

export function getNamespaceRequest(request: any): NamespaceStore | undefined {
  return request[NAMESPACE_KEY] instanceof NamespaceStore
    ? request[NAMESPACE_KEY]
    : undefined;
}
