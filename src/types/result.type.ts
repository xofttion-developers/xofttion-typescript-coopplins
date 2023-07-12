import { Sealed } from '@xofttion/utils';

export class Result<S, F, V = any> extends Sealed<
  V,
  S | F,
  {
    success: (state?: S) => V;
    failure: (state?: F) => V;
  }
> {
  public static success<S>(value?: S): Result<S, any> {
    return new Result('success', value);
  }

  public static failure<F>(value?: F): Result<any, F> {
    return new Result('failure', value);
  }
}

export type ResultInvalid<T = unknown> = {
  data: T;
  statusCode: number;
};

export type ResultServer<T = unknown> = Result<T, ResultInvalid | unknown>;
