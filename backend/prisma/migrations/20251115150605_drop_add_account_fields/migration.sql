/*
  Warnings:

  - You are about to drop the column `isEmailAuth` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `isGoogleSigned` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `account` DROP COLUMN `isEmailAuth`,
    DROP COLUMN `isGoogleSigned`,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `provider` ENUM('google', 'local') NOT NULL DEFAULT 'local';
