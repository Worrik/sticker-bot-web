export interface IPage<T> {
  page: number;
  per_page: number;
  total: number;
  has_next: boolean;
  items: Array<T>;
}

export interface IPaginatedDataProvider<T> {
  items: Array<T>;
  loading: boolean;
  error: any;
  paginator: IPaginator;
  loadMore(): Promise<void>;
}

export interface IPaginator {
  page: number;
  perPage: number;
  hasNext?: boolean;
}