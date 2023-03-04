import { ArgumentsConfig } from '../types';

type FunctionMap = Map<string | symbol, ArgumentsConfig[]>;
type ControllerMap = Map<Function, FunctionMap>;

class ArgumentStore {
  private collection: ControllerMap = new Map();

  public add(controller: Function, config: ArgumentsConfig): void {
    const { token, index } = config;

    const argsCollection = this.get(controller, token);

    argsCollection[index] = config;
  }

  public get(controller: Function, token: string | symbol): ArgumentsConfig[] {
    const functionMap = this.getFunctionMap(controller);

    const current = functionMap.get(token);

    if (current) {
      return current;
    }

    const collection: ArgumentsConfig[] = [];

    functionMap.set(token, collection);

    return collection;
  }

  private getFunctionMap(controller: Function): FunctionMap {
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
