import { TRecord, TSortType } from './global.interface';
export interface IDataTable<T> {
    count: number;
    rows: T[];
}
export interface IFindAllPaginateOptions {
    pageNumber?: number;
    perPage?: number;
    filters?: TRecord;
    q?: string;
    ignoreGlobal?: string[];
    sort?: string;
    order?: TSortType;
    include?: any;
}
