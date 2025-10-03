/*
  Warnings:

  - You are about to drop the column `commune` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `communeCode` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `districtCode` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `provinceCode` on the `address` table. All the data in the column will be lost.
  - Added the required column `districtId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `commune`,
    DROP COLUMN `communeCode`,
    DROP COLUMN `district`,
    DROP COLUMN `districtCode`,
    DROP COLUMN `province`,
    DROP COLUMN `provinceCode`,
    ADD COLUMN `districtId` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `provinceId` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `wardId` INTEGER UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_wardId_fkey` FOREIGN KEY (`wardId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
