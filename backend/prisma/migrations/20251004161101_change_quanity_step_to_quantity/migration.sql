/*
  Warnings:

  - You are about to drop the column `quanity_step` on the `wholesale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `wholesale` RENAME COLUMN `quanity_step` TO `quantity_step`;
