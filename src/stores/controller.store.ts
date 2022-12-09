import { ControllerConfig } from '../types';

type ConfigMap = Map<Function, ControllerConfig>;

class ControllerStore {
  private _collection: ConfigMap = new Map();

  public add(controller: Function, config: ControllerConfig): void {
    this._collection.set(controller, config);
  }

  public get(controller: Function): ControllerConfig | undefined {
    return this._collection.get(controller);
  }
}

export const controllersStore = new ControllerStore();
