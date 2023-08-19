import { RouteConfig } from '../types';

type RouteIndex = Map<string, RouteConfig>;
type ControllerIndex = Map<Function, RouteIndex>;

class RouteStore {
  private collection: ControllerIndex = new Map();

  public push(controller: Function, config: RouteConfig): void {
    const indexs = this.fetchRouteIndex(controller);

    const { http, path } = config;

    indexs.set(`${http}:${path}`, config);
  }

  public fetch(controller: Function): RouteConfig[] {
    const indexs = this.fetchRouteIndex(controller);

    return Array.from(indexs.values());
  }

  private fetchRouteIndex(controller: Function): RouteIndex {
    const current = this.collection.get(controller);

    if (current) {
      return current;
    }

    const indexs = new Map<string, RouteConfig>();

    this.collection.set(controller, indexs);

    return indexs;
  }
}

export const routes = new RouteStore();
