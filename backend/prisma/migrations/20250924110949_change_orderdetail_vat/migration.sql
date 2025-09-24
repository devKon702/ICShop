/*
  Warnings:

  - The `vat` column on the `orderdetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `orderdetail` DROP COLUMN `vat`,
    ADD COLUMN `vat` DECIMAL(3, 2) NOT NULL DEFAULT 0;
