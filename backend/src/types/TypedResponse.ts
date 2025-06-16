import { Response } from "express";
import { ResponseObject } from "../models/response";

export type TypedResponse<Body = ResponseObject> = Response<Body>;
