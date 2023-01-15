export type ArgumentsType = 'BODY' | 'HEADER'| 'PATH' | 'QUERY';

export type ArgumentsConfig = {
  functionKey: string | symbol;
  index: number;
  key?: string;
  type: ArgumentsType;
};
