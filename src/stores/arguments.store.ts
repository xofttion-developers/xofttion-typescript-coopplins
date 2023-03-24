import { ArgumentsConfig } from '../types';

type ArgumentMap = Map<string | symbol, ArgumentsConfig[]>;
type ControllerMap = Map<Function, ArgumentMap>;

class ArgumentStore {
  private collection: ControllerMap = new Map();

  public add(controller: Function, config: ArgumentsConfig): void {
    const { token, index } = config;

    const argsCollection = this.get(controller, token);

    argsCollection[index] = config;
  }

  public get(controller: Function, token: string | symbol): ArgumentsConfig[] {
    const functionMap = this.getArgumentMap(controller);

    const current = functionMap.get(token);

    if (current) {
      return current;
    }

    const collection: ArgumentsConfig[] = [];

    functionMap.set(token, collection);

    return collection;
  }

  private getArgumentMap(controller: Function): ArgumentMap {
    const current = this.collection.get(controller);

    if (current) {
      return current;
    }

    const map = new Map<string | symbol, ArgumentsConfig[]>();

    this.collection.set(controller, map);

    return map;
  }
}

export const args = new ArgumentStore();
