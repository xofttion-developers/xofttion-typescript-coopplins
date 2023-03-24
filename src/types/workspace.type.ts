import { WorkspaceStore } from '@xofttion/dependency-injection';

export const WORKSPACE_KEY = 'workspace';

export function getWorkspaceRequest(request: any): WorkspaceStore | undefined {
  return request[WORKSPACE_KEY] instanceof WorkspaceStore
    ? request[WORKSPACE_KEY]
    : undefined;
}
