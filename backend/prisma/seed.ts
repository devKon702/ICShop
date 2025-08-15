import { PrismaClient } from "@prisma/client";
import accountRepository from "../src/repositories/account.repository";
import { hashPassword } from "../src/utils/bcrypt";
import { Role } from "../src/constants/db";
const prisma = new PrismaClient();

async function main() {
  // Kiểm tra nếu chưa có admin thì tạo mới
  const admin = await accountRepository.findFirstAdmin();
  if (!admin) {
    await prisma.account.create({
      data: {
        email: "nhatkha117@gmail.com",
        password: await hashPassword("123456"),
        role: Role.ADMIN,
        user: { create: { name: "Nhật Kha" } },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seed data created");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
