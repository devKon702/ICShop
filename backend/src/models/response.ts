import { AnyZodObject } from "zod";
import { safeStringify } from "../utils/safeStringify";

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

export class ResponseObject {
  code: number | StatusCode | string;
  message: string;
  data: object | null | object[];
  constructor(
    code: number | StatusCode,
    message: string,
    data: object | null | object[]
  ) {
    this.code = code;
    this.message = message;
    this.data = JSON.parse(safeStringify(data));
  }
}

export interface BaseSchema {
  createSchema: AnyZodObject;
  updateSchema: AnyZodObject;
}
