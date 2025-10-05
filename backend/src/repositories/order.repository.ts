import { Decimal } from "@prisma/client/runtime/library";
import { DeliveryType, OrderStatus } from "../constants/db";
import { prisma } from "../prisma";

class OrderRepository {
  public filterByUserId = (
    userId: number,
    filter: {
      page: number;
      limit: number;
      from?: Date;
      to?: Date;
      order: "create_asc" | "create_desc" | "update_asc" | "update_desc";
      status?: OrderStatus;
    }
  ) => {
    const where: any = { userId, status: filter.status };

    if (filter.from || filter.to) {
      where.createdAt = {};
      if (filter.from) {
        where.createdAt.gte = filter.from;
      }
      if (filter.to) {
        where.createdAt.lte = filter.to;
      }
    }

    const orderBy: any = {};
    switch (filter.order) {
      case "create_asc":
        orderBy.createdAt = "asc";
        break;
      case "create_desc":
        orderBy.createdAt = "desc";
        break;
      case "update_asc":
        orderBy.updatedAt = "asc";
        break;
      case "update_desc":
        orderBy.updatedAt = "desc";
        break;
    }
    return Promise.all([
      prisma.order.findMany({
        where,
        include: {
          details: true,
        },
        take: filter.limit,
        skip: (filter.page - 1) * filter.limit,
        orderBy,
      }),
      prisma.order.count({ where }),
    ]);
  };

  public findByIdAndUserId = (id: number, userId: number) => {
    return prisma.order.findUnique({
      where: { id, userId },
      include: {
        details: {
          include: {
            product: {
              select: { id: true, posterUrl: true, name: true, slug: true },
            },
          },
        },
        timelines: true,
      },
    });
  };

  public findDetailById = (id: number) => {
    return prisma.order.findUnique({
      where: { id },
      include: { details: { include: { product: true } }, timelines: true },
    });
  };

  public findById = (id: number) => {
    return prisma.order.findUnique({ where: { id } });
  };

  getOrderByUserIdAndOrderStatusId = (
    userId: number,
    orderStatusId: number,
    page: number,
    limit: number
  ) => {
    return prisma.order.findMany({
      where: { userId },
      include: {
        details: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  };

  public create = async (
    userId: number,
    data: {
      receiverName: string;
      receiverPhone: string;
      deliveryFee: Decimal;
      deliveryType: DeliveryType;
      province: string;
      district: string;
      commune: string;
      detail: string;
      earliestReceiveTime: Date;
      latestReceiveTime: Date;
      status: OrderStatus;
      desc: string;
      details: {
        productId: number;
        quantity: number;
        unitPrice: Decimal;
        vat: Decimal;
      }[];
    }
  ) => {
    const total = data.details
      .map((item) =>
        item.unitPrice.mul(item.quantity).mul(item.vat.div(100).add(1))
      )
      .reduce((a, b) => a.add(b), Decimal(0))
      .add(data.deliveryFee);
    return prisma.order.create({
      data: {
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        deliveryFee: data.deliveryFee,
        deliveryType: data.deliveryType,
        province: data.province,
        district: data.district,
        commune: data.commune,
        detail: data.detail,
        earliestReceiveTime: data.earliestReceiveTime,
        latestReceiveTime: data.latestReceiveTime,
        userId: userId,
        status: data.status,
        total,
        creatorId: userId,
        modifierId: userId,
        details: {
          createMany: {
            data: data.details.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              vat: item.vat,
              creatorId: userId,
              modifierId: userId,
            })),
          },
        },
        timelines: {
          create: {
            status: data.status,
            desc: data.desc,
            creatorId: userId,
            modifierId: userId,
            isRead: false,
          },
        },
      },
      include: {
        details: true,
        timelines: true,
      },
    });
  };

  public changeOrderStatus = (
    userId: number,
    id: number,
    data: { status: OrderStatus; desc: string }
  ) => {
    return prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        version: { increment: 1 },
        modifierId: userId,
        timelines: {
          create: {
            status: data.status,
            isRead: false,
            creatorId: userId,
            modifierId: userId,
            desc: data.desc,
          },
        },
      },
      include: { timelines: true },
    });
  };

  public seenOrderTimeline = (userId: number, id: number) => {
    return prisma.orderTimeline.update({
      where: { id, order: { userId } },
      data: { isRead: true, version: { increment: 1 }, modifierId: userId },
    });
  };

  public findMyUnseenTimeline = (userId: number) => {
    return prisma.orderTimeline.findMany({
      where: { isRead: false, order: { userId } },
    });
  };

  public changeTimelineDesc = (userId: number, id: number, desc: string) => {
    return prisma.orderTimeline.update({
      where: { id },
      data: { version: { increment: 1 }, modifierId: userId, desc },
    });
  };

  public filterOrder = (data: {
    code?: string;
    status?: number;
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
    order: "create_asc" | "create_desc" | "update_asc" | "update_desc";
  }) => {
    const where: any = {};
    if (data.code) where.code = { startsWith: data.code };
    if (data.status) where.status = data.status;
    if (data.startDate || data.endDate) {
      where.createdAt = {};
      if (data.startDate) {
        where.createdAt.gte = data.startDate;
      }
      if (data.endDate) {
        where.createdAt.lte = data.endDate;
      }
    }
    const orderBy: any = {};
    switch (data.order) {
      case "create_asc":
        orderBy.createdAt = "asc";
        break;
      case "create_desc":
        orderBy.createdAt = "desc";
        break;
      case "update_asc":
        orderBy.updatedAt = "asc";
        break;
      case "update_desc":
        orderBy.updatedAt = "desc";
        break;
    }

    return Promise.all([
      prisma.order.findMany({
        where,
        take: data.limit,
        skip: data.limit * (data.page - 1),
        orderBy,
        include: { user: true },
      }),
      prisma.order.count({ where }),
    ]);
  };
}

export default new OrderRepository();
