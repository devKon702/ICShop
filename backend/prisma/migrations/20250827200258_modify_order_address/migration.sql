/*
  Warnings:

  - You are about to drop the column `address` on the `order` table. All the data in the column will be lost.
  - Added the required column `commune` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `address`,
    ADD COLUMN `commune` TINYTEXT NOT NULL,
    ADD COLUMN `detail` TEXT NOT NULL,
    ADD COLUMN `district` TINYTEXT NOT NULL,
    ADD COLUMN `province` TINYTEXT NOT NULL;
