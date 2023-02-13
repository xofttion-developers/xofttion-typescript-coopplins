export enum ArgumentsType {
  Body = 1,
  Header = 2,
  Path = 3,
  Query = 4
}

export type ArgumentsConfig = {
  functionKey: string | symbol;
  index: number;
  key?: string;
  type: ArgumentsType;
};
