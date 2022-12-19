import { RouteConfig } from '../types';

type ConfigMap = Map<string, RouteConfig>;
type ControllerMap = Map<Function, ConfigMap>;

class RouteStore {
  private _collection: ControllerMap = new Map();

  public add(controller: Function, config: RouteConfig): void {
    const controllerMap = this._getControllerMap(controller);

    controllerMap.set(config.path, config);
  }

  public get(controller: Function): RouteConfig[] {
    const controllerMap = this._getControllerMap(controller);

    return Array.from(controllerMap.values());
  }

  private _getControllerMap(controller: Function): ConfigMap {
    const currentConfig = this._collection.get(controller);

    if (currentConfig) {
      return currentConfig;
    }

    const routeConfig = new Map<string, RouteConfig>();

    this._collection.set(controller, routeConfig);

    return routeConfig;
  }
}

export const routes = new RouteStore();
