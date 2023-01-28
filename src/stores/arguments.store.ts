import { ArgumentsConfig } from '../types';

type FunctionMap = Map<string | symbol, ArgumentsConfig[]>;
type ControllerMap = Map<Function, FunctionMap>;

class ArgumentStore {
  private collection: ControllerMap = new Map();

  public add(controller: Function, config: ArgumentsConfig): void {
    const { functionKey, index } = config;

    const argsCollection = this.get(controller, functionKey);

    argsCollection[index] = config;
  }

  public get(controller: Function, functionKey: string | symbol): ArgumentsConfig[] {
    const functionMap = this.getFunctionMap(controller);

    const currentArgs = functionMap.get(functionKey);

    if (currentArgs) {
      return currentArgs;
    }

    const argsCollection: ArgumentsConfig[] = [];

    functionMap.set(functionKey, argsCollection);

    return argsCollection;
  }

  private getFunctionMap(controller: Function): FunctionMap {
    const currentFunction = this.collection.get(controller);

    if (currentFunction) {
      return currentFunction;
    }

    const functionMap = new Map<string | symbol, ArgumentsConfig[]>();

    this.collection.set(controller, functionMap);

    return functionMap;
  }
}

export const argsStore = new ArgumentStore();
