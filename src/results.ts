import { HttpCode, Result, ResultServer } from './types';

export function resultSuccessful<T>(data: T): ResultServer {
  return Result.success(data);
}

export function resultBadRequest<T>(data: T): ResultServer {
  return resultFailure(HttpCode.BadRequest, data);
}

export function resultUnauthorized<T>(data: T): ResultServer {
  return resultFailure(HttpCode.Unauthorized, data);
}

export function resultForbidden<T>(data: T): ResultServer {
  return resultFailure(HttpCode.Forbidden, data);
}

export function resultNotFound<T>(data: T): ResultServer {
  return resultFailure(HttpCode.NotFound, data);
}

export function resultInternalServerError<T>(data: T): ResultServer {
  return resultFailure(HttpCode.InternalServerError, data);
}

function resultFailure<T>(statusCode: HttpCode, data: T): ResultServer {
  return Result.failure({ statusCode, data });
}
