import { HttpCode } from './types';

export class CoopplinsError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly data?: any
  ) {
    super(message);
  }
}

export class BadRequestError extends CoopplinsError {
  constructor(message: string, data?: any) {
    super(HttpCode.BadRequest, message, data);
  }
}

export class UnauthorizedError extends CoopplinsError {
  constructor(message: string, data?: any) {
    super(HttpCode.Unauthorized, message, data);
  }
}

export class ForbiddenError extends CoopplinsError {
  constructor(message: string, data?: any) {
    super(HttpCode.Forbidden, message, data);
  }
}

export class NotFoundError extends CoopplinsError {
  constructor(message: string, data?: any) {
    super(HttpCode.NotFound, message, data);
  }
}

export class UnprocessableDomain extends CoopplinsError {
  constructor(message: string, data?: any) {
    super(HttpCode.UnprocessableDomain, message, data);
  }
}

export class InternalServerError extends CoopplinsError {
  constructor(message: string, data?: any) {
    super(HttpCode.InternalServerError, message, data);
  }
}
