import { Either } from '@xofttion/utils';
import { HttpCode, Result } from './types';

export function resultBadRequest(data: any): Result {
  return Either.left({ statusCode: HttpCode.BadRequest, data });
}

export function resultUnauthorized(data: any): Result {
  return Either.left({ statusCode: HttpCode.Unauthorized, data });
}

export function resultForbidden(data: any): Result {
  return Either.left({ statusCode: HttpCode.Forbidden, data });
}

export function resultNotFound(data: any): Result {
  return Either.left({ statusCode: HttpCode.NotFound, data });
}

export function resultInternalServerError(data: any): Result {
  return Either.left({ statusCode: HttpCode.InternalServerError, data });
}
