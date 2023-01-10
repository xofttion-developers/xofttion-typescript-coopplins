import { ArgumentsConfig } from '../types';

type FunctionConfigMap = Map<string | symbol, ArgumentsConfig[]>;
type ControllerMap = Map<Function, FunctionConfigMap>;

class ArgumentStore {
  private _collection: ControllerMap = new Map();

  public add(controller: Function, config: ArgumentsConfig): void {
    const { functionKey, index } = config;

    const argumentsCollection = this.get(controller, functionKey);

    argumentsCollection[index] = config;
  }

  public get(controller: Function, functionKey: string | symbol): ArgumentsConfig[] {
    const functionMap = this._getFunctionMap(controller);

    const currentArguments = functionMap.get(functionKey);

    if (currentArguments) {
      return currentArguments;
    }

    const argumentsCollection: ArgumentsConfig[] = [];

    functionMap.set(functionKey, argumentsCollection);

    return argumentsCollection;
  }

  private _getFunctionMap(controller: Function): FunctionConfigMap {
    const currentFunction = this._collection.get(controller);

    if (currentFunction) {
      return currentFunction;
    }

    const functionMap = new Map<string | symbol, ArgumentsConfig[]>();

    this._collection.set(controller, functionMap);

    return functionMap;
  }
}

export const ArgumentsStore = new ArgumentStore();
