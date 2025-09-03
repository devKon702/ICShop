import { Role } from "../constants/db";
import { prisma } from "../prisma";

class AccountRepository {
  public findFirstAdmin = async () => {
    return prisma.account.findFirst({ where: { role: "admin" } });
  };

  public findByEmail = async (email: string, role: Role = Role.USER) => {
    return prisma.account.findUnique({
      where: { email, role },
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
    return prisma.account.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        user: true,
      },
    });
    // return prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   include: {
    //     account: { omit: { password: true } },
    //   },
    // });
  };

  public create = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: Role = Role.USER
  ) => {
    const newAccount = await prisma.account.create({
      data: {
        email,
        password,
        user: {
          create: { name, phone },
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

  public changePassword = async (
    accountId: number,
    userId: number,
    newPass: string
  ) => {
    return prisma.account.update({
      data: {
        password: newPass,
        version: { increment: 1 },
        modifierId: userId,
      },
      where: {
        id: accountId,
      },
    });
  };

  public filter = async ({
    email,
    name,
    role,
    page,
    limit,
  }: {
    email: string | undefined;
    name: string | undefined;
    role: Role;
    page: number;
    limit: number;
  }) => {
    const whereObj = {
      ...(email && { email: { contains: email } }),
      ...(name && {
        user: {
          name: { contains: name },
        },
      }),
      role,
    };
    const filterPs = prisma.account.findMany({
      where: whereObj,
      select: {
        id: true,
        email: true,
        isEmailAuth: true,
        isGoogleSigned: true,
        createdAt: true,
        creatorId: true,
        modifierId: true,
        updatedAt: true,
        version: true,
        role: true,
        isActive: true,
        user: true,
      },
      take: limit,
      skip: limit * (page - 1 < 0 ? 0 : page - 1),
    });
    const countPs = prisma.account.count({ where: whereObj });
    return Promise.all([filterPs, countPs]);
  };

  public lock = async (
    accountId: number,
    isActive: boolean,
    modifierId: number
  ) => {
    return prisma.account.update({
      data: {
        isActive,
        modifierId,
        version: { increment: 1 },
      },
      where: {
        id: accountId,
      },
    });
  };
}
export default new AccountRepository();
