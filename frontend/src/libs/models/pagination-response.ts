export type PaginationResponse<T> = {
  code: number;
  message: string;
  data: T;
  total: number;
  page: number;
  limit: number;
};
