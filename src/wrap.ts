import InjectableFactory from '@xofttion/dependency-injection';
import { Request, Response } from 'express';
import { ServerEntityDatabase } from './database';

type Call = (request: Request, response: Response) => Promise<any>;

export async function wrapStandard(
  req: Request,
  res: Response,
  call: Call
): Promise<any> {
  try {
    const result = await call(req, res);

    res.status(200).json(result);
  } catch {
    res.status(500).json({
      message: 'Ocurrio un error durante la ejecucción del proceso'
    });
  }
}

export async function wrapTransaction(
  req: Request,
  res: Response,
  call: Call
): Promise<any> {
  const entityDatabase = InjectableFactory(ServerEntityDatabase);

  try {
    await entityDatabase.connect();
    await entityDatabase.transaction();

    const result = await call(req, res);

    res.status(200).json(result);

    await entityDatabase.commit();
  } catch {
    await entityDatabase.rollback();

    res.status(500).json({
      message: 'Ocurrio un error durante la ejecucción del proceso'
    });
  } finally {
    await entityDatabase.disconnect();
  }
}
