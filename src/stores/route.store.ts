import { RouteConfig } from '../types';

type RouteMap = Map<string, RouteConfig>;
type ControllerMap = Map<Function, RouteMap>;

class RouteStore {
  private collection: ControllerMap = new Map();

  public add(controller: Function, config: RouteConfig): void {
    const routeMap = this.getRouteMap(controller);

    const { http, path } = config;

    routeMap.set(`${http}:${path}`, config);
  }

  public get(controller: Function): RouteConfig[] {
    const routeMap = this.getRouteMap(controller);

    return Array.from(routeMap.values());
  }

  private getRouteMap(controller: Function): RouteMap {
    const currentRoute = this.collection.get(controller);

    if (currentRoute) {
      return currentRoute;
    }

    const routeMap = new Map<string, RouteConfig>();

    this.collection.set(controller, routeMap);

    return routeMap;
  }
}

export const RoutesStore = new RouteStore();
