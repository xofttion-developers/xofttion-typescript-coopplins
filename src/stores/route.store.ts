import { RouteConfig } from '../types';

type RouteConfigMap = Map<string, RouteConfig>;
type ControllerMap = Map<Function, RouteConfigMap>;

class RouteStore {
  private _collection: ControllerMap = new Map();

  public add(controller: Function, config: RouteConfig): void {
    const routeMap = this._getRouteMap(controller);

    routeMap.set(config.path, config);
  }

  public get(controller: Function): RouteConfig[] {
    const routeMap = this._getRouteMap(controller);

    return Array.from(routeMap.values());
  }

  private _getRouteMap(controller: Function): RouteConfigMap {
    const currentRoute = this._collection.get(controller);

    if (currentRoute) {
      return currentRoute;
    }

    const routeConfig = new Map<string, RouteConfig>();

    this._collection.set(controller, routeConfig);

    return routeConfig;
  }
}

export const RoutesStore = new RouteStore();
