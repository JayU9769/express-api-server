export interface DataTable<T> {
  count: number;
  rows: T[];
}

export interface FindAllPaginateOptions {
  pageNumber?: number;
  perPage?: number;
  filters?: Record<string, any>;
  q?: string;
  ignoreGlobal?: string[];
  sort?: string;
  order?: 'ASC' | 'DESC';
}
