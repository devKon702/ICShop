/*
  Warnings:

  - Added the required column `communeCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceCode` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `communeCode` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `districtCode` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `provinceCode` INTEGER UNSIGNED NOT NULL;
