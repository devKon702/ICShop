import { prisma } from "../prisma";

class AccountRepository {
  findFirstAdmin = async () => {
    return prisma.account.findFirst({ where: { role: "admin" } });
  };

  findByEmail = async (email: string) => {
    return await prisma.account.findUnique({
      where: { email },
      include: { user: true },
    });
  };

  findAccountById = async (id: number) => {
    return await prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  };

  createAccount = async () => {};
}
export default new AccountRepository();
