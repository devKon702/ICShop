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
      order: "create_asc" | "create_desc";
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
              omit: {
                desc: true,
              },
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
      include: {
        creator: { include: { account: { select: { email: true } } } },
        user: { include: { account: { select: { email: true } } } },
        details: { include: { product: { omit: { desc: true } } } },
        timelines: {
          include: {
            creator: { include: { account: { select: { email: true } } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
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
        unit: string;
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
              unit: item.unit,
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
    data: { status: OrderStatus; desc: string; isRead?: boolean }
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
            isRead: data.isRead,
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
    email?: string;
    receiverPhone?: string;
    status?: number;
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
    order: "create_asc" | "create_desc" | "update_asc" | "update_desc";
  }) => {
    const where: any = {};
    if (data.code) where.code = { startsWith: data.code };
    if (data.email)
      where.user = {
        account: { email: { startsWith: data.email } },
      };
    if (data.receiverPhone)
      where.receiverPhone = { endsWith: data.receiverPhone };
    if (data.status !== undefined) where.status = data.status;
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
        include: {
          user: { include: { account: { select: { email: true } } } },
        },
      }),
      prisma.order.count({ where }),
    ]);
  };

  public findManyByProductId = (
    productId: number,
    filter: {
      page: number;
      limit: number;
      from: Date | undefined;
      to: Date | undefined;
      status?: OrderStatus;
      sortBy: "asc" | "desc";
    }
  ) => {
    return Promise.all([
      prisma.order.findMany({
        where: {
          status: filter.status,
          details: {
            some: {
              productId,
            },
          },
          createdAt: {
            gte: filter.from,
            lte: filter.to,
          },
        },
        take: filter.limit,
        skip: filter.limit * (filter.page - 1),
        orderBy: { createdAt: filter.sortBy },
        include: {
          user: { include: { account: true } },
        },
      }),
      prisma.order.count({
        where: {
          status: filter.status,
          details: {
            some: {
              productId,
            },
          },
          createdAt: {
            gte: filter.from,
            lte: filter.to,
          },
        },
      }),
    ]);
  };

  public findBestSellingProducts = async (
    from: Date | undefined,
    to: Date | undefined,
    limit: number
  ) => {
    const result = await prisma.orderDetail.groupBy({
      by: ["productId", "unit"],
      _count: {
        id: true,
      },
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          updatedAt: {
            gte: from,
            lte: to,
          },
          status: OrderStatus.DONE,
        },
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: limit,
    });
    const products = await prisma.product.findMany({
      where: {
        id: { in: result.map((item) => item.productId) },
      },
      omit: {
        desc: true,
      },
    });

    return result.map((item) => ({
      product: products.find((p) => p.id === item.productId)!,
      unit: item.unit,
      totalOrder: item._count.id,
      totalQuantity: item._sum.quantity!,
    }));
  };

  public countByStatus = (from?: Date, to?: Date) => {
    return prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
    });
  };

  public countByCreated = (startOfDay: Date, endOfDay: Date) => {
    return prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  };

  public findTopUsersByOrderCount = (opts: {
    limit: number;
    from?: Date;
    to?: Date;
    orderBy: "asc" | "desc";
  }) => {
    return prisma.order.groupBy({
      by: ["userId"],
      _count: { id: true },
      where: {
        status: { notIn: [OrderStatus.CANCELED, OrderStatus.PENDING] },
        createdAt: {
          gte: opts.from,
          lte: opts.to,
        },
      },
      orderBy: {
        _count: {
          id: opts.orderBy,
        },
      },
      take: opts.limit,
    });
  };

  public findManyByUserId = (
    userId: number,
    filter: {
      status?: OrderStatus;
      page: number;
      limit: number;
      from?: Date;
      to?: Date;
      sortBy: "asc" | "desc";
    }
  ) => {
    return Promise.all([
      prisma.order.findMany({
        where: {
          userId,
          status: filter.status,
          createdAt: { gte: filter.from, lte: filter.to },
        },
        orderBy: { createdAt: filter.sortBy },
        include: {
          _count: {
            select: {
              details: true,
            },
          },
        },
        take: filter.limit,
        skip: filter.limit * (filter.page - 1),
      }),
      prisma.order.count({
        where: {
          userId,
          status: filter.status,
          createdAt: { gte: filter.from, lte: filter.to },
        },
      }),
    ]);
  };
  public updateOrderById = (
    id: number,
    data: {
      modifierId: number;
      receiverName?: string;
      receiverPhone?: string;
      province?: string;
      district?: string;
      commune?: string;
      detail?: string;
      deliveryFee?: Decimal;
      deliveryType?: DeliveryType;
      earliestReceiveTime?: Date;
      latestReceiveTime?: Date;
      total?: Decimal;
    }
  ) => {
    return prisma.order.update({
      where: { id },
      data: {
        receiverName: data.receiverName,
        receiverPhone: data.receiverPhone,
        province: data.province,
        district: data.district,
        commune: data.commune,
        detail: data.detail,
        deliveryFee: data.deliveryFee,
        deliveryType: data.deliveryType,
        earliestReceiveTime: data.earliestReceiveTime,
        latestReceiveTime: data.latestReceiveTime,
        total: data.total,
        modifierId: data.modifierId,
        version: { increment: 1 },
      },
    });
  };
}
export default new OrderRepository();
