import { ArgumentsConfig } from '../types';

type Token = string | symbol;
type ArgumentIndex = Map<Token, ArgumentsConfig[]>;
type ControllerIndex = Map<Function, ArgumentIndex>;

class ArgumentStore {
  private collection: ControllerIndex = new Map();

  public push(controller: Function, config: ArgumentsConfig): void {
    const { name: token, index } = config;

    const argsCollection = this.fetch(controller, token);

    argsCollection[index] = config;
  }

  public fetch(controller: Function, token: Token): ArgumentsConfig[] {
    const argsIndexs = this.fetchArgumentIndex(controller);

    const current = argsIndexs.get(token);

    if (current) {
      return current;
    }

    const collection: ArgumentsConfig[] = [];

    argsIndexs.set(token, collection);

    return collection;
  }

  private fetchArgumentIndex(controller: Function): ArgumentIndex {
    const current = this.collection.get(controller);

    if (current) {
      return current;
    }

    const indexs = new Map<Token, ArgumentsConfig[]>();

    this.collection.set(controller, indexs);

    return indexs;
  }
}

export const args = new ArgumentStore();
