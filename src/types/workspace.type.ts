import { WorkSpace } from '@xofttion/dependency-injection';

export function fetchWorkSpace(request: any): WorkSpace | undefined {
  return request['workspace'] instanceof WorkSpace
    ? request['workspace']
    : undefined;
}

export function putWorkSpace(request: any, workspace: WorkSpace): void {
  request['workspace'] = workspace;
}
