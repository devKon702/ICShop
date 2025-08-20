import { Role } from "../constants/db";
import { prisma } from "../prisma";

class UserRepository {
  public findById = async (userId: number) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: true,
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
}

export default new UserRepository();
