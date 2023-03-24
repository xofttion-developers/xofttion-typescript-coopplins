import { InjectableToken } from '@xofttion/dependency-injection';

export type ArgumentsDataType = 'string' | 'number' | 'boolean' | 'object';

export enum ArgumentsType {
  Body = 1,
  Header = 2,
  Path = 3,
  Query = 4,
  Provide = 9
}

export type ArgumentsConfig = {
  index: number;
  token: string | symbol;
  type: ArgumentsType;
  dataType?: ArgumentsDataType;
  key?: string;
  target?: InjectableToken;
};
