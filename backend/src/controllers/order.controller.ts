import { Request, Response } from "express";
import { TypedRequest } from "../types/TypedRequest";
import orderRepository from "../repositories/order.repository";
import { ResponseObject, StatusCode } from "../models/response";
import { TokenPayload } from "../types/token-payload";
import {
  cancleOrderSchema,
  createOrderSchema,
  createOrderTimelineSchema,
  filterOrderSchema,
  getMyOrderSchema,
  getOrderByIdSchema,
  seenOrderTimelineSchema,
  updateTimelineDescSchema,
} from "../schemas/order.schema";
import wholesaleRepository from "../repositories/wholesale.repository";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { OrderResponseCode } from "../constants/codes/order.code";
import { OrderStatus } from "../constants/db";
import { successResponse } from "../utils/response";
import { Decimal } from "@prisma/client/runtime/library";
import { time } from "console";

class OrderController {
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: {
        receiverName,
        receiverPhone,
        deliveryType,
        province,
        district,
        commune,
        detail,
        products,
      },
    } = createOrderSchema.parse(req);
    // Get unit price + vat for each product
    const productPrices = await Promise.all(
      products.map((item) =>
        wholesaleRepository.findByQuantity(item.productId, item.quantity)
      )
    );
    // Check if some productId not exist
    if (productPrices.some((item) => item === null))
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        OrderResponseCode.INVALID_PRICE,
        "Không tìm được giá cho sản phẩm",
        true
      );

    // Check valid product quantity
    products.forEach((item, index) => {
      const { max_quantity, min_quantity, quanity_step } =
        productPrices[index]!.wholesale;
      if (item.quantity < min_quantity)
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          OrderResponseCode.INVALID_PRODUCT_QUANTITY,
          `Tối thiểu mua ${min_quantity}`,
          true
        );
      if (item.quantity > max_quantity)
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          OrderResponseCode.INVALID_PRODUCT_QUANTITY,
          `Tối đa mua ${max_quantity}`,
          true
        );
      if (item.productId % quanity_step)
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          OrderResponseCode.INVALID_PRODUCT_QUANTITY,
          `Bội số mua là ${quanity_step}`,
          true
        );
    });

    const details = products.map((item, index) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: productPrices[index]!.price,
      vat: productPrices[index]!.wholesale.vat,
    }));
    // Get delivery fee
    const deliveryFee = Decimal(0);
    // Get expected receive time
    const earliestReceiveTime = new Date(Date.now());
    const latestReceiveTime = new Date(Date.now());

    const order = await orderRepository.create(sub, {
      receiverName,
      receiverPhone,
      province,
      district,
      commune,
      detail,
      deliveryFee,
      deliveryType,
      earliestReceiveTime,
      latestReceiveTime,
      status: OrderStatus.PENDING,
      desc: "Khởi tạo đơn hàng",
      details: details,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(OrderResponseCode.OK, "Tạo đơn hàng thành công", order)
      );
  };

  public getMyOrder = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      query: { status, page, limit, from, to },
    } = getMyOrderSchema.parse(req);
    const [orders, total] = await orderRepository.findByUserId(sub, {
      page,
      limit,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy danh sách đơn hàng thành công",
          orders,
          { limit, page, total }
        )
      );
  };

  public getMyOrderById = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
    } = getOrderByIdSchema.parse(req);
    const order = await orderRepository.findByIdAndUserId(id, sub);
    if (!order)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy đơn hàng",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy thông tin đơn hàng thành công",
          order
        )
      );
  };
  public adminGetOrderById = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = res.locals.tokenPayload as TokenPayload;
    const order = await orderRepository.findDetailById(id);
    if (!order)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy đơn hàng",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy thông tin đơn hàng thành công",
          order
        )
      );
  };

  public cancelOrder = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: { desc },
    } = cancleOrderSchema.parse(req);

    const order = await orderRepository.findById(id);
    if (!order)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy đơn hàng",
        true
      );
    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        OrderResponseCode.INVALID_STATUS_CHANGE,
        "Không thể hủy đơn hàng này",
        true
      );
    }
    if (order.userId !== sub)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        OrderResponseCode.FORBIDDEN,
        "Không có đủ quyền hạn",
        true
      );
    const newOrder = await orderRepository.changeOrderStatus(sub, id, {
      desc,
      status: OrderStatus.CANCELED,
    });
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Hủy đơn hàng thành công",
          newOrder
        )
      );
  };

  public seenOrderTimeline = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
    } = seenOrderTimelineSchema.parse(req);

    const timeline = await orderRepository.seenOrderTimeline(sub, id);
    if (timeline)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy thông báo",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Tắt thông báo thành công",
          timeline
        )
      );
  };

  public getMyUnseenOrderTimeline = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const timelines = await orderRepository.findMyUnseenTimeline(sub);
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy thông báo thành công",
          timelines
        )
      );
  };

  public adminChangeOrderStatus = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: { status, desc },
    } = createOrderTimelineSchema.parse(req);

    const order = await orderRepository.findById(id);
    if (!order) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy đơn hàng",
        true
      );
    }
    if (order.status === status) {
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.INVALID_STATUS_CHANGE,
        "Trạng thái đơn hàng không đổi",
        true
      );
    }

    const newOrder = await orderRepository.changeOrderStatus(sub, id, {
      status,
      desc,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Thay đổi trạng thái đơn hàng thành công",
          newOrder
        )
      );
  };

  public adminUpdateTimelineDesc = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      params: { id },
      body: { desc },
    } = updateTimelineDescSchema.parse(req);
    const timeline = await orderRepository.changeTimelineDesc(sub, id, desc);
    if (!timeline)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        OrderResponseCode.TIMELINE_NOT_FOUND,
        "Không tìm thấy lịch sử trạng thái",
        true
      );
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Cập nhật mô tả thay đổi trạng thái thành công",
          timeline
        )
      );
  };

  public adminFilterOrder = async (req: Request, res: Response) => {
    const {
      query: { code, status, page, limit, startDate, endDate, order },
    } = filterOrderSchema.parse(req);

    const [result, total] = await orderRepository.filterOrder({
      code,
      status,
      page,
      limit,
      order,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lọc đơn hàng thành công",
          result,
          { page, limit, total }
        )
      );
  };
}

export default new OrderController();
