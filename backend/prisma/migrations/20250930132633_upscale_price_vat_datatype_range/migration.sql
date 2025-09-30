/*
  Warnings:

  - You are about to alter the column `deliveryFee` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(15,3)`.
  - You are about to alter the column `total` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(15,3)`.
  - You are about to alter the column `unitPrice` on the `orderdetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(15,3)`.
  - You are about to alter the column `vat` on the `orderdetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `Decimal(5,2)`.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(15,3)`.
  - You are about to alter the column `vat` on the `wholesale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `Decimal(5,2)`.
  - You are about to alter the column `price` on the `wholesaledetail` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,3)` to `Decimal(15,3)`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `deliveryFee` DECIMAL(15, 3) NOT NULL,
    MODIFY `total` DECIMAL(15, 3) NOT NULL;

-- AlterTable
ALTER TABLE `orderdetail` MODIFY `unitPrice` DECIMAL(15, 3) NOT NULL,
    MODIFY `vat` DECIMAL(5, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(15, 3) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `wholesale` MODIFY `vat` DECIMAL(5, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `wholesaledetail` MODIFY `price` DECIMAL(15, 3) NOT NULL;
