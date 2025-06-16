import { ResponseObject, StatusCode } from "./response";

export class PaginationResponse extends ResponseObject {
  total: number;
  page: number;
  limit: number;
  constructor(
    code: number | StatusCode,
    message: string,
    data: object | null | object[],
    pagination: { total: number; page: number; limit: number }
  ) {
    super(code, message, data);
    this.total = pagination.total;
    this.page = pagination.page;
    this.limit = pagination.limit;
  }
}
