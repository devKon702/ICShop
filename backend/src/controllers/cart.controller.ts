import { Request, Response } from "express";
import { TypedRequest } from "../types/TypedRequest";
import { ResponseObject, StatusCode } from "../models/response";
import cartDetailRepository from "../repositories/cart.repository";
import { TokenPayload } from "../types/token-payload";
import cartRepository from "../repositories/cart.repository";
import { HttpStatus } from "../constants/http-status";
import { CartResponseCode } from "../constants/codes/cart.code";
import { successResponse } from "../utils/response";
import {
  createCartSchema,
  deleteMultiCartSchema,
} from "../schemas/cart.schema";
import { AccessTokenPayload } from "../services/jwt.service";

class CartController {
  public getMyCart = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const cart = await cartRepository.getCart(sub);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(CartResponseCode.OK, "Lấy giỏ hàng thành công", cart)
      );
  };

  public createCart = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { productId },
    } = createCartSchema.parse(req);
    const existing = await cartDetailRepository.findByUserIdAndProductId(
      sub,
      productId
    );
    let cart;
    if (existing) cart = await cartRepository.updateCart(existing.id);
    else cart = await cartRepository.createCart(sub, productId);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CartResponseCode.OK,
          "Thêm vào giỏ hàng thành công",
          cart
        )
      );
  };

  public deleteMultiCart = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { cartIds },
    } = deleteMultiCartSchema.parse(req);

    const deleted = await Promise.all(
      cartIds.map((item) => cartRepository.deleteCart(item, sub))
    );

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          CartResponseCode.OK,
          "Xóa sản phẩm khỏi giỏ hàng thành công",
          deleted
        )
      );
  };
}

export default new CartController();
