import { InjectableToken } from '@xofttion/dependency-injection/dist/types';

export enum ArgumentsType {
  Body = 1,
  Header = 2,
  Path = 3,
  Query = 4,
  Provide = 9
}

export type ArgumentsConfig = {
  token: string | symbol;
  index: number;
  key?: string;
  type: ArgumentsType;
  target?: InjectableToken;
};
