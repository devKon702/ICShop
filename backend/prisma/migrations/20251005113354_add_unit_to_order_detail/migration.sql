/*
  Warnings:

  - Added the required column `unit` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderdetail` ADD COLUMN `unit` TINYTEXT NULL;
-- UpdateData
UPDATE `orderdetail` SET `unit` = "cái" WHERE `unit` IS NULL;

ALTER TABLE `orderdetail` MODIFY COLUMN `unit` TINYTEXT NOT NULL;