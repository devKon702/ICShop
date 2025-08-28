/*
  Warnings:

  - You are about to alter the column `unitPrice` on the `orderdetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(13,3)` to `Decimal(10,3)`.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(13,3)` to `Decimal(10,3)`.
  - You are about to alter the column `price` on the `wholesaledetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(13,3)` to `Decimal(10,3)`.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `total` DECIMAL(10, 3) NOT NULL;

-- AlterTable
ALTER TABLE `orderdetail` MODIFY `unitPrice` DECIMAL(10, 3) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(10, 3) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `wholesaledetail` MODIFY `price` DECIMAL(10, 3) NOT NULL;
