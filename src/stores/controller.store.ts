import { ControllerConfig } from '../types';

type ControllerMap = Map<Function, ControllerConfig>;

class ControllerStore {
  private collection: ControllerMap = new Map();

  public add(controller: Function, config: ControllerConfig): void {
    this.collection.set(controller, config);
  }

  public get(controller: Function): ControllerConfig | undefined {
    return this.collection.get(controller);
  }
}

export const controllersStore = new ControllerStore();
