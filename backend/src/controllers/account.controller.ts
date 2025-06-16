import { Response } from "express";
import accountRepository from "../repositories/account.repository";
import { TypedRequest } from "../types/TypedRequest";
import { ResponseObject, StatusCode } from "../models/response";

const getAccountInformation = async (
  req: TypedRequest<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const account = await accountRepository.findAccountById(Number(id));
    if (!account) {
      res.json(new ResponseObject(404, "Not found", null));
      return;
    }
    const { password, ...accountWithoutPassword } = account;
    res.json(new ResponseObject(200, "success", accountWithoutPassword));
  } catch {
    res
      .status(400)
      .json(new ResponseObject(StatusCode.BAD_REQUEST, "fail", null));
  }
};

export default { getAccountInformation };
