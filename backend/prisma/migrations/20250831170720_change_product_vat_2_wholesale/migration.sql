/*
  Warnings:

  - You are about to drop the column `vat` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `vat`;

-- AlterTable
ALTER TABLE `wholesale` ADD COLUMN `vat` TINYINT UNSIGNED NOT NULL DEFAULT 0;
