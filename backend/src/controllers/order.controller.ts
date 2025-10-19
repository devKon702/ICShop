import { Request, Response } from "express";
import orderRepository from "../repositories/order.repository";
import { TokenPayload } from "../types/token-payload";
import {
  cancleOrderSchema,
  createOrderSchema,
  createOrderTimelineSchema,
  adminFilterOrdersSchema,
  filterMyOrdersSchema,
  getOrderByIdSchema,
  seenOrderTimelineSchema,
  updateTimelineDescSchema,
} from "../schemas/order.schema";
import wholesaleRepository from "../repositories/wholesale.repository";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { OrderResponseCode } from "../constants/codes/order.code";
import { DeliveryType, OrderStatus } from "../constants/db";
import { successResponse } from "../utils/response";
import { Decimal } from "@prisma/client/runtime/library";
import addressRepository from "../repositories/address.repository";
import { NotFoundError } from "../errors/not-found-error";

class OrderController {
  // USER
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { addressId, deliveryType, products, receiverName, receiverPhone },
    } = createOrderSchema.parse(req);

    // Grouping products
    const productMap = new Map<number, number>();
    products.forEach((item) => {
      if (productMap.has(item.productId)) {
        productMap.set(
          item.productId,
          productMap.get(item.productId)! + item.quantity
        );
      } else {
        productMap.set(item.productId, item.quantity);
      }
    });
    const groupedProducts = Array.from(productMap, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    // Check exist address
    const address =
      deliveryType === DeliveryType.POST && addressId
        ? await addressRepository.findById(addressId, sub)
        : null;
    if (deliveryType === DeliveryType.POST && !address)
      throw new NotFoundError("Địa chỉ không tồn tại");

    // Get unit price + vat for each product
    const productPrices = await Promise.all(
      groupedProducts.map((item) =>
        wholesaleRepository.findByQuantity(item.productId, item.quantity)
      )
    );
    // Check if some product price not exist ~ product not exist
    if (productPrices.some((item) => item === null))
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        OrderResponseCode.INVALID_PRICE,
        "Sản phẩm không tồn tại",
        true
      );

    // Check valid product quantity
    groupedProducts.forEach((item, index) => {
      const { max_quantity, min_quantity, quantity_step } =
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
      if (item.productId % quantity_step)
        throw new AppError(
          HttpStatus.UNPROCESSABLE_ENTITY,
          OrderResponseCode.INVALID_PRODUCT_QUANTITY,
          `Bội số mua là ${quantity_step}`,
          true
        );
    });

    // Prepare order details
    const details = groupedProducts.map((item, index) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: productPrices[index]!.price,
      vat: productPrices[index]!.wholesale.vat,
      unit: productPrices[index]!.wholesale.unit,
    }));
    // Get delivery fee
    const deliveryFee = Decimal(0);
    // Get expected receive time
    const earliestReceiveTime = new Date(Date.now());
    const latestReceiveTime = new Date(Date.now());

    const order = await orderRepository.create(sub, {
      receiverName:
        deliveryType === DeliveryType.POST
          ? address!.receiverName
          : receiverName!,
      receiverPhone:
        deliveryType === DeliveryType.POST
          ? address!.receiverPhone
          : receiverPhone!,
      province:
        deliveryType === DeliveryType.POST ? address!.province.name : "",
      district:
        deliveryType === DeliveryType.POST ? address!.district.name : "",
      commune: deliveryType === DeliveryType.POST ? address!.ward.name : "",
      detail: deliveryType === DeliveryType.POST ? address!.detail : "",
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
  public filterMyOrders = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      query: { status, page, limit, from, to, order },
    } = filterMyOrdersSchema.parse(req);
    const [orders, total] = await orderRepository.filterByUserId(sub, {
      page,
      limit,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      status,
      order,
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
  // ADMIN
  public adminFilterOrder = async (req: Request, res: Response) => {
    const {
      query: {
        code,
        email,
        receiverPhone,
        status,
        page,
        limit,
        from: startDate,
        to: endDate,
        sortBy: order,
      },
    } = adminFilterOrdersSchema.parse(req);

    const [result, total] = await orderRepository.filterOrder({
      code,
      email,
      receiverPhone,
      status,
      page,
      limit,
      order,
      startDate: startDate,
      endDate: endDate,
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

  public adminGetOrderById = async (req: Request, res: Response) => {
    const {
      params: { id },
    } = getOrderByIdSchema.parse(req);
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

  public adminChangeOrderStatus = async (req: Request, res: Response) => {
    const { sub } = res.locals.tokenPayload as TokenPayload;
    const {
      body: { status, desc, orderId },
    } = createOrderTimelineSchema.parse(req);

    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Không tìm thấy đơn hàng");
    }
    if (order.status === status) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        OrderResponseCode.INVALID_STATUS_CHANGE,
        "Trạng thái đơn hàng không đổi",
        true
      );
    }

    const newOrder = await orderRepository.changeOrderStatus(sub, orderId, {
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
}

export default new OrderController();
