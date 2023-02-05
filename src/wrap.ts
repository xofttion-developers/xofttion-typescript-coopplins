import { Either } from '@xofttion/utils';
import { Request, Response } from 'express';
import { HTTP_CODE, Result } from './types';

type Call = (req: Request, res: Response) => Promise<Result | any>;
type WrapOptions = {
  callback: Call;
  error?: (ex: unknown) => void;
  request: Request;
  response: Response;
};

export function wrap(options: WrapOptions): Promise<void> {
  const { request, response, callback, error } = options;

  return callback(request, response)
    .then((result) => {
      if (result instanceof Either) {
        result.fold({
          right: (data) => {
            response.status(HTTP_CODE.OK).json(data);
          },
          left: ({ statusCode, data }) => {
            response.status(statusCode).json(data);
          }
        });
      } else {
        response.status(HTTP_CODE.OK).json(result);
      }
    })
    .catch((ex) => {
      if (error) {
        error(ex); // Handler error
      }

      response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred during the execution of the process'
      });
    });
}
