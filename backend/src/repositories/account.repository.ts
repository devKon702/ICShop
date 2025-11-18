import { start } from "repl";
import { Role } from "../constants/db";
import { prisma } from "../prisma";
import { Account } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";

class AccountRepository {
  public findFirstAdmin = async () => {
    return prisma.account.findFirst({ where: { role: "admin" } });
  };

  public findByEmail = async (email: string, role?: Role) => {
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

  public create = async (data: {
    email: string;
    password: string | null;
    name: string;
    phone?: string;
    emailVerified?: boolean;
    provider: "local" | "google";
    avatarUrl?: string;
    role: Role;
  }) => {
    const newAccount = await prisma.account.create({
      data: {
        email: data.email,
        password: data.password,
        emailVerified: data.emailVerified || false,
        provider: data.provider,
        user: {
          create: {
            name: data.name,
            phone: data.phone,
            avatarUrl: data.avatarUrl,
          },
        },
        role: data.role,
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
    phone,
    role,
    page,
    limit,
    sortBy,
  }: {
    email: string | undefined;
    name: string | undefined;
    phone: string | undefined;
    role: Role;
    page: number;
    limit: number;
    sortBy: "created-asc" | "created-desc" | "name-asc" | "name-desc";
  }) => {
    const whereObj = {
      ...(email && { email: { contains: email } }),
      ...(name && {
        user: {
          name: { contains: name },
        },
      }),
      ...(phone && {
        user: {
          phone: { contains: phone },
        },
      }),
      role,
    };
    const filterPs = prisma.account.findMany({
      where: whereObj,
      include: { user: true },
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        ...(sortBy === "created-asc" && { createdAt: "asc" }),
        ...(sortBy === "created-desc" && { createdAt: "desc" }),
        ...(sortBy === "name-asc" && { user: { name: "asc" } }),
        ...(sortBy === "name-desc" && { user: { name: "desc" } }),
      },
    });
    const countPs = prisma.account.count({ where: whereObj });
    return Promise.all([filterPs, countPs]);
  };

  public changeStatus = async (
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

  public update = async (
    accountId: number,
    modifierId: number,
    data: Partial<
      Pick<Account, "email" | "isActive" | "password" | "emailVerified">
    >
  ) => {
    return prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...data,
        modifierId,
        version: { increment: 1 },
      },
    });
  };
}
export default new AccountRepository();
