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
  getOrdersByProductIdSchema,
  adminGetOrderByUserSchema,
  changeOrderAddressSchema,
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
import productRepository from "../repositories/product.repository";
import { findByIdSchema } from "../schemas/shared.schema";
import { sanitizeData } from "../utils/sanitize";
import { AccessTokenPayload } from "../services/jwt.service";
import { ProductResponseCode } from "../constants/codes/product.code";
import cartRepository from "../repositories/cart.repository";

class OrderController {
  // USER
  public create = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
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
    // Check product exist in cart
    await Promise.all(
      groupedProducts.map(async (item) => {
        const cartDetail = await cartRepository.findByUserIdAndProductId(
          sub,
          item.productId
        );
        if (!cartDetail) {
          const product = await productRepository.findById(item.productId);
          if (!product) {
            throw new AppError(
              HttpStatus.UNPROCESSABLE_ENTITY,
              ProductResponseCode.NOT_FOUND,
              `Sản phẩm không tồn tại`,
              true
            );
          }
          throw new AppError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            OrderResponseCode.FORBIDDEN,
            `Vui lòng thêm sản phẩm ${product?.name.slice(0, 20).trim()}${
              product?.name.length > 20 ? "..." : ""
            } vào giỏ hàng trước khi đặt hàng`,
            true
          );
        }
      })
    );

    // Check exist address
    const address =
      deliveryType === DeliveryType.POST && addressId
        ? await addressRepository.findById(addressId, sub)
        : null;
    if (deliveryType === DeliveryType.POST && !address)
      throw new NotFoundError(
        OrderResponseCode.ADDRESS_NOT_FOUND,
        "Không tìm thấy địa chỉ"
      );

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
    const { sub } = res.locals.auth as AccessTokenPayload;
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
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      params: { id },
    } = getOrderByIdSchema.parse(req);
    const order = await orderRepository.findByIdAndUserId(id, sub);
    if (!order)
      throw new NotFoundError(
        "Không tìm thấy đơn hàng",
        OrderResponseCode.NOT_FOUND
      );
    const responseBody = {
      ...order,
      details: sanitizeData(order.details, { omit: ["desc"] }),
    };
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy thông tin đơn hàng thành công",
          responseBody
        )
      );
  };
  public cancelOrder = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      params: { id },
      body: { desc },
    } = cancleOrderSchema.parse(req);

    const order = await orderRepository.findById(id);
    // Check order exist
    if (!order)
      throw new NotFoundError(
        "Không tìm thấy đơn hàng",
        OrderResponseCode.NOT_FOUND
      );
    // Check order belong to user
    if (order.userId !== sub)
      throw new AppError(
        HttpStatus.FORBIDDEN,
        OrderResponseCode.FORBIDDEN,
        "Không có đủ quyền hạn",
        true
      );
    // Check order status changeable
    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        OrderResponseCode.INVALID_STATUS_CHANGE,
        "Không thể hủy đơn hàng này",
        true
      );
    }
    const newOrder = await orderRepository.changeOrderStatus(sub, id, {
      desc,
      status: OrderStatus.CANCELED,
      isRead: true,
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
    const { sub } = res.locals.auth as AccessTokenPayload;
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
    const { sub } = res.locals.auth as AccessTokenPayload;
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
  public updateOrderAddress = async (req: Request, res: Response) => {
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      params: { id },
      body: { addressId, deliveryType, receiverName, receiverPhone },
    } = changeOrderAddressSchema.parse(req);
    const [order, address] = await Promise.all([
      orderRepository.findById(id),
      deliveryType === DeliveryType.POST
        ? addressRepository.findById(addressId ?? 0, sub)
        : null,
    ]);
    if (deliveryType === DeliveryType.POST && !address) {
      throw new NotFoundError(
        OrderResponseCode.ADDRESS_NOT_FOUND,
        "Không tìm thấy địa chỉ"
      );
    }
    if (!order || order.userId !== sub) {
      throw new NotFoundError(
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy đơn hàng"
      );
    }
    const updatedOrder = await (deliveryType === DeliveryType.POST
      ? orderRepository.updateOrderById(id, {
          modifierId: sub,
          receiverName: address!.receiverName,
          receiverPhone: address!.receiverPhone,
          province: address!.province.name,
          district: address!.district.name,
          commune: address!.ward.name,
          detail: address!.detail,
          deliveryFee: Decimal(0),
          earliestReceiveTime: new Date(Date.now()),
          latestReceiveTime: new Date(Date.now()),
          total: undefined,
        })
      : orderRepository.updateOrderById(id, {
          modifierId: sub,
          receiverName: receiverName!,
          receiverPhone: receiverPhone!,
          province: "",
          district: "",
          commune: "",
          detail: "",
          deliveryFee: Decimal(0),
          earliestReceiveTime: undefined,
          latestReceiveTime: undefined,
          total: undefined,
        }));
    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Cập nhật địa chỉ giao hàng thành công",
          updatedOrder
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
    const { sub } = res.locals.auth as AccessTokenPayload;
    const {
      body: { status, desc, orderId },
    } = createOrderTimelineSchema.parse(req);

    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError(
        OrderResponseCode.NOT_FOUND,
        "Không tìm thấy đơn hàng"
      );
    }

    // A list of valid status changes from current status like: {[currentStatus]: [validNewStatus1, validNewStatus2, ...]}
    const validStatusChanges: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELED],
      [OrderStatus.PAID]: [
        OrderStatus.PROCESSING,
        OrderStatus.PENDING,
        OrderStatus.CANCELED,
      ],
      [OrderStatus.PROCESSING]: [
        OrderStatus.SHIPPING,
        OrderStatus.PAID,
        OrderStatus.CANCELED,
      ],
      [OrderStatus.SHIPPING]: [
        OrderStatus.DONE,
        OrderStatus.PROCESSING,
        OrderStatus.CANCELED,
      ],
      [OrderStatus.DONE]: [OrderStatus.SHIPPING, OrderStatus.CANCELED],
      [OrderStatus.CANCELED]: [OrderStatus.PENDING, OrderStatus.PAID],
    };
    // Check if the desired status change is valid
    if (!validStatusChanges[order.status as OrderStatus].includes(status)) {
      throw new AppError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        OrderResponseCode.INVALID_STATUS_CHANGE,
        `Chuyển đổi trạng thái không hợp lệ`,
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
    const { sub } = res.locals.auth as AccessTokenPayload;
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

  public adminFindByProductId = async (req: Request, res: Response) => {
    const {
      params: { id },
      query: { page, limit, from, to, sortBy, status },
    } = getOrdersByProductIdSchema.parse(req);
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError(
        ProductResponseCode.NOT_FOUND,
        "Không tìm thấy sản phẩm"
      );
    }

    const [orders, total] = await orderRepository.findManyByProductId(id, {
      page,
      limit,
      from,
      to,
      sortBy,
      status,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy đơn hàng theo sản phẩm thành công",
          sanitizeData(orders, { omit: ["password"] }),
          { page, limit, total }
        )
      );
  };

  public adminGetOrderByUser = async (req: Request, res: Response) => {
    const {
      params: { id },
      query: { page, limit, sortBy, status, from, to },
    } = adminGetOrderByUserSchema.parse(req);
    const [orders, total] = await orderRepository.findManyByUserId(id, {
      status,
      page,
      limit,
      sortBy,
      from,
      to,
    });

    res
      .status(HttpStatus.OK)
      .json(
        successResponse(
          OrderResponseCode.OK,
          "Lấy đơn hàng theo người dùng thành công",
          orders,
          { page, limit, total }
        )
      );
  };
}

export default new OrderController();
