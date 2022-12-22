import { Either } from '@xofttion/utils';
import { Request, Response } from 'express';
import { HTTP_CODE, Result } from './types';

type Call = (req: Request, res: Response) => Promise<Result | any>;

type WrapOptions = {
  call: Call;
  production?: boolean;
  request: Request;
  response: Response;
};

export async function wrap(options: WrapOptions): Promise<any> {
  const { request, response, call, production } = options;

  try {
    const controllerResult = await call(request, response);

    if (controllerResult instanceof Either) {
      controllerResult.fold({
        right: (result) => {
          response.status(HTTP_CODE.OK).json(result);
        },
        left: (result) => {
          response.status(result.statusCode).json(result.data);
        }
      });
    } else {
      response.status(HTTP_CODE.OK).json(controllerResult);
    }
  } catch (ex) {
    if (!production) {
      console.log(ex);
    }
  
    response.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({
      message: 'An error occurred during the execution of the process'
    });
  }
}
