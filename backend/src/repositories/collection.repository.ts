import { ppid } from "process";
import { prisma } from "../prisma";

class CollectionRepository {
  public create = async (
    userId: number,
    data: {
      name: string;
      isActive: boolean;
      slug: string;
      desc: string;
      position?: number;
    }
  ) => {
    return prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        desc: data.desc,
        position: data.position,
        isActive: data.isActive,
        creatorId: userId,
        modifierId: userId,
      },
    });
  };

  public updateById = async (
    userId: number,
    collectionId: number,
    data: {
      name?: string;
      isActive?: boolean;
      slug?: string;
      desc?: string;
      position?: number;
    }
  ) => {
    return prisma.collection.update({
      where: { id: collectionId },
      data: {
        name: data.name,
        slug: data.slug,
        desc: data.desc,
        position: data.position,
        isActive: data.isActive,
        version: { increment: 1 },
        modifierId: userId,
      },
    });
  };

  public deleteById = async (id: number) => {
    return prisma.collection.delete({ where: { id } });
  };

  public findMany = async (opts?: {
    isActive?: boolean;
    limit?: number;
    orderBy: "asc" | "desc";
    product?: {
      isActive?: boolean;
      limit?: number;
      orderBy: "asc" | "desc";
    };
  }) => {
    return prisma.collection.findMany({
      where: { isActive: opts?.isActive },
      ...(opts?.product && {
        include: {
          productCollections: {
            where: {
              product: { isActive: opts?.product.isActive },
            },
            include: {
              product: {
                omit: { desc: true },
                include: {
                  category: true,
                },
              },
            },
            take: opts?.limit,
            orderBy: {
              position: opts?.product.orderBy,
            },
          },
        },
      }),
      orderBy: {
        position: opts?.orderBy,
      },
    });
  };

  public findBySlug = async (slug: string, isActive?: boolean) => {
    return prisma.collection.findUnique({
      where: { slug, isActive },
      include: {
        productCollections: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  public findManyByName = async (name: string, isActive?: boolean) => {
    return prisma.collection.findMany({
      where: { name: { contains: name }, isActive },
      include: {
        productCollections: {
          where: {
            product: { isActive },
          },
          include: {
            product: true,
          },
        },
      },
    });
  };

  public findById = async (id: number) => {
    return prisma.collection.findUnique({
      where: { id },
      include: {
        productCollections: {
          include: {
            product: true,
          },
        },
      },
    });
  };

  public findProductCollectionById = async (id: number) => {
    return prisma.productCollection.findUnique({
      where: { id },
    });
  };

  public createProductCollection = async (
    userId: number,
    data: {
      collectionId: number;
      productId: number;
      position?: number;
    }
  ) => {
    return prisma.productCollection.create({
      data: {
        collectionId: data.collectionId,
        productId: data.productId,
        position: data.position,
        creatorId: userId,
        modifierId: userId,
      },
    });
  };

  public updateProductCollectionById = async (
    userId: number,
    id: number,
    data: {
      position: number;
    }
  ) => {
    return prisma.productCollection.update({
      where: { id },
      data: {
        position: data.position,
        version: { increment: 1 },
        modifierId: userId,
      },
    });
  };

  public deleteProductCollectionById = async (id: number) => {
    return prisma.productCollection.delete({ where: { id } });
  };
}

export default new CollectionRepository();
