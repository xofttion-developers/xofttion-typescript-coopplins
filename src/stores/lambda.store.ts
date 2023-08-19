import { Optional } from '@xofttion/utils';
import { LambdaConfig } from '../types';

type LambdaMap = Map<Function, LambdaConfig>;

class LambdaStore {
  private collection: LambdaMap = new Map();

  public push(lambda: Function, config: LambdaConfig): void {
    this.collection.set(lambda, config);
  }

  public fetch(lambda: Function): Optional<LambdaConfig> {
    return Optional.build(this.collection.get(lambda));
  }
}

export const lambdas = new LambdaStore();
