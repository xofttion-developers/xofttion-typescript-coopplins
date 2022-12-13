import InjectableFactory from '@xofttion/dependency-injection';
import { Either } from '@xofttion/utils';
import { Request, Response } from 'express';
import { CoopplinsEntityDatabase } from './database';
import { EitherController } from './types';

type Call = (
  request: Request,
  response: Response
) => Promise<EitherController | any>;

type WrapOptions = {
  call: Call;
  production?: boolean;
  request: Request;
  response: Response;
};

export async function wrapStandard(options: WrapOptions): Promise<any> {
  const { request, response, call, production } = options;

  try {
    const controllerResult = await call(request, response);

    if (controllerResult instanceof Either) {
      controllerResult.fold({
        right: (result) => {
          response.status(200).json(result);
        },
        left: (result) => {
          response.status(result.statusCode).json(result.data);
        }
      });
    } else {
      response.status(200).json(controllerResult);
    }
  } catch (ex) {
    wrapException(response, ex, production);
  }
}

export async function wrapTransaction(options: WrapOptions): Promise<any> {
  const { request, response, call, production } = options;

  const entityDatabase = InjectableFactory(CoopplinsEntityDatabase);

  try {
    await entityDatabase.connect();
    await entityDatabase.transaction();

    const controllerResult = await call(request, response);

    if (controllerResult instanceof Either) {
      controllerResult.fold({
        right: (result) => {
          response.status(200).json(result);
        },
        left: (result) => {
          response.status(result.statusCode).json(result.data);
        }
      });
    } else {
      response.status(200).json(controllerResult);
    }

    await entityDatabase.commit();
  } catch (ex) {
    await entityDatabase.rollback();

    wrapException(response, ex, production);
  } finally {
    await entityDatabase.disconnect();
  }
}

function wrapException(response: Response, exception: any, production?: boolean) {
  if (!production) {
    console.log(exception);
  }

  response.status(500).json({
    message: 'An error occurred during the execution of the process'
  });
}
