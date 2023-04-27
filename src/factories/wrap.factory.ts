import { Result } from '@xofttion/utils';
import { Request, Response } from 'express';
import { CoopplinsError } from '../exceptions';
import { HttpCode, ResultServer } from '../types';

const message = 'An error occurred during the execution of the process';
const errorCode = HttpCode.InternalServerError;

type WrapCallback = (req: Request, res: Response) => Promise<any>;
type WrapCall = (req: Request, res: Response) => Promise<ResultServer | any> | any;
type WrapError = (ex: unknown) => void;

type WrapConfig = {
  callback: WrapCall;
  error?: WrapError;
  request: Request;
  response: Response;
};

export function createWrap(callback: WrapCall, error?: WrapError): WrapCallback {
  return (request: Request, response: Response) => {
    return wrap({ request, response, error, callback });
  };
}

function wrap(config: WrapConfig): Promise<any> {
  const { request, response, callback } = config;

  const result = callback(request, response);

  if (!(result instanceof Promise)) {
    return Promise.resolve(response.status(HttpCode.Ok).json(result));
  }

  return result
    .then((result) => resolvePromise(result, response))
    .catch((exception) => catchPromise(exception, config));
}

function resolvePromise(result: any, response: Response): void {
  if (result instanceof Result) {
    result.when(
      (data) => {
        response.status(HttpCode.Ok).json(data);
      },
      ({ statusCode, data }) => {
        response.status(statusCode).json(data);
      }
    );
  } else {
    response.status(HttpCode.Ok).json(result);
  }
}

function catchPromise(exception: any, config: WrapConfig): void {
  const { response, error } = config;

  if (error) {
    error(exception); // Handler error
  }

  if (exception instanceof CoopplinsError) {
    const { code, data, message } = exception;

    response.status(code).json({ message, data });
  } else {
    response.status(errorCode).json({ message });
  }
}
