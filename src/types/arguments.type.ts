export type ArgumentsType = 'BODY' | 'HEADER' | 'QUERY';

export type ArgumentsConfig = {
  functionKey: string | symbol;
  index: number;
  key?: string;
  type: ArgumentsType;
};
