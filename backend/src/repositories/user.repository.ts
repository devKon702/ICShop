import { Role } from "../constants/db";
import { prisma } from "../prisma";

class UserRepository {
  public findById = async (userId: number) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: {
          omit: { password: true },
        },
      },
    });
  };
  public updateName = async (userId: number, name: string) => {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        version: { increment: 1 },
        modifierId: userId,
      },
    });
  };

  public updateAvatar = async (userId: number, avatarUrl: string) => {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
        version: { increment: 1 },
        modifierId: userId,
      },
    });
  };

  public countUser = (opts?: {
    from?: Date;
    to?: Date;
    isActive?: boolean;
  }) => {
    const { from, to, isActive } = opts ?? {};
    return prisma.user.count({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
        account: {
          isActive,
          role: Role.USER,
        },
      },
    });
  };
}

export default new UserRepository();
