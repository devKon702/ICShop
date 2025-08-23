import { PrismaClient } from "@prisma/client";
import accountRepository from "../src/repositories/account.repository";
import { hashPassword } from "../src/utils/bcrypt";
import { Role } from "../src/constants/db";
import { logger } from "../src/utils/logger";
const prisma = new PrismaClient();

async function main() {
  // Kiểm tra nếu chưa có admin thì tạo mới
  const admin = await accountRepository.findFirstAdmin();
  if (!admin) {
    await accountRepository.create(
      "nhatkha117@gmail.com",
      await hashPassword("123456"),
      "Admin",
      Role.ADMIN
    );
  }
}

main()
  .then(() => {
    logger.info("Seed data created");
  })
  .catch((e) => {
    logger.error("Seed data failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
