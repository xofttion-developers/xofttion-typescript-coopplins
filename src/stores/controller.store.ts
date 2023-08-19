import { Optional } from '@xofttion/utils';
import { ControllerConfig } from '../types';

type ControllerMap = Map<Function, ControllerConfig>;

class ControllerStore {
  private collection: ControllerMap = new Map();

  public push(controller: Function, config: ControllerConfig): void {
    this.collection.set(controller, config);
  }

  public fetch(controller: Function): Optional<ControllerConfig> {
    return Optional.build(this.collection.get(controller));
  }
}

export const controllers = new ControllerStore();
