import { Request, Response } from 'express';
import { CoopplinsError } from '../exceptions';
import { HttpCode, Result, ResultServer } from '../types';

const message = 'An error occurred during the execution of the process';
const errorCode = HttpCode.InternalServerError;

type FnWrap = (req: Request, res: Response) => Promise<any>;
type FnCallback = (req: Request, res: Response) => Promise<ResultServer | any> | any;
type FnError = (error: unknown) => void;

type Settings = {
  callback: FnCallback;
  handleError?: FnError;
  request: Request;
  response: Response;
};

export function createWrap(callback: FnCallback, handleError?: FnError): FnWrap {
  return (request: Request, response: Response) =>
    wrap({ request, response, handleError, callback });
}

function wrap(settings: Settings): Promise<any> {
  const { request, response, callback } = settings;

  const result = callback(request, response);

  if (!(result instanceof Promise)) {
    return Promise.resolve(response.status(HttpCode.Ok).json(result));
  }

  return result
    .then((result) => resolvePromise(result, response))
    .catch((error) => catchPromise(error, settings));
}

function resolvePromise(result: any, response: Response): void {
  if (result instanceof Result) {
    result.when({
      success: (data) => {
        response.status(HttpCode.Ok).json(data);
      },
      failure: ({ statusCode, data }) => {
        response.status(statusCode || errorCode).json(data);
      }
    });
  } else {
    response.status(HttpCode.Ok).json(result);
  }
}

function catchPromise(exception: any, settings: Settings): void {
  const { response, handleError } = settings;

  if (handleError) {
    handleError(exception); // Listener error
  }

  if (exception instanceof CoopplinsError) {
    const { code, data, message } = exception;

    response.status(code).json({ message, data });
  } else {
    response.status(errorCode).json({ message });
  }
}
