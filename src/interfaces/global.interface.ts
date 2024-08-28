export type TSortType = 'ASC' | 'DESC';

export type TRecord = Record<string, any>;

export interface IUpdateAction {
  ids: Array<string | number>;
  field: {
    name: string;
    value: string;
  };
}
