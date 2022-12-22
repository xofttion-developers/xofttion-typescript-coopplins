import { Either } from '@xofttion/utils';
import { HTTP_CODE, Result } from './types';

export function resultBadRequest(data: any): Result {
  return Either.left({ statusCode: HTTP_CODE.BAD_REQUEST, data });
}

export function resultUnauthorized(data: any): Result {
  return Either.left({ statusCode: HTTP_CODE.UNAUTHORIZED, data });
}

export function resultForbidden(data: any): Result {
  return Either.left({ statusCode: HTTP_CODE.FORBIDDEN, data });
}

export function resultNotFound(data: any): Result {
  return Either.left({ statusCode: HTTP_CODE.NOT_FOUND, data });
}

export function resultInternalServerError(data: any): Result {
  return Either.left({ statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, data });
}
