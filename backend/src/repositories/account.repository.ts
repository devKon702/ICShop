import { prisma } from "../prisma";

const findByEmail = async (email: string) => {
  return await prisma.account.findUnique({
    where: { email },
    include: { user: true },
  });
};

const findAccountById = async (id: number) => {
  return await prisma.account.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
};

const createAccount = async () => {};

export default { findByEmail, createAccount, findAccountById };
