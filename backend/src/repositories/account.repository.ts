import { Role } from "../constants/db";
import { prisma } from "../prisma";

class AccountRepository {
  public findFirstAdmin = async () => {
    return prisma.account.findFirst({ where: { role: "admin" } });
  };

  public findByEmail = async (email: string) => {
    return prisma.account.findUnique({
      where: { email },
      include: { user: true },
    });
  };

  public findById = async (id: number) => {
    return prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  };

  public findByUserId = async (userId: number) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        account: { omit: { password: true } },
      },
    });
  };

  public createAccount = async (
    email: string,
    password: string,
    name: string,
    role: Role = Role.USER
  ) => {
    const newAccount = await prisma.account.create({
      data: {
        email,
        password,
        user: {
          create: { name },
        },
        role,
      },
      include: { user: true },
    });
    const userId = newAccount.user?.id;

    return prisma.account.update({
      where: { id: newAccount.id },
      data: {
        creatorId: userId,
        modifierId: userId,
        user: { update: { creatorId: userId, modifierId: userId } },
      },
      include: { user: true },
    });
  };
}
export default new AccountRepository();
