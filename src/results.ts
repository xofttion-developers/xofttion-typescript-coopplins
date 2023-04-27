import { Result } from '@xofttion/utils';
import { HttpCode, ResultServer } from './types';

export function resultBadRequest(data: any): ResultServer {
  return Result.failure({ statusCode: HttpCode.BadRequest, data });
}

export function resultUnauthorized(data: any): ResultServer {
  return Result.failure({ statusCode: HttpCode.Unauthorized, data });
}

export function resultForbidden(data: any): ResultServer {
  return Result.failure({ statusCode: HttpCode.Forbidden, data });
}

export function resultNotFound(data: any): ResultServer {
  return Result.failure({ statusCode: HttpCode.NotFound, data });
}

export function resultInternalServerError(data: any): ResultServer {
  return Result.failure({ statusCode: HttpCode.InternalServerError, data });
}
