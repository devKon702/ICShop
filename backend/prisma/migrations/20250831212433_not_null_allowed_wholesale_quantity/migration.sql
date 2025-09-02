/*
  Warnings:

  - Made the column `max_quantity` on table `wholesale` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `wholesale` MODIFY `max_quantity` INTEGER UNSIGNED NOT NULL;
