/*
  Warnings:

  - Added the required column `type` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `banner` ADD COLUMN `type` VARCHAR(10) NOT NULL;

-- CreateTable
CREATE TABLE `OrderPayment` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER UNSIGNED NOT NULL,
    `paymentMethodCode` VARCHAR(50) NOT NULL,
    `snapshotConfig` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrderPayment_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethod` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` TINYTEXT NOT NULL,
    `desc` TEXT NOT NULL,
    `position` TINYINT UNSIGNED NOT NULL DEFAULT 1,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `creatorId` INTEGER UNSIGNED NOT NULL,
    `modifierId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PaymentMethod_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentConfig` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `paymentMethodId` INTEGER UNSIGNED NOT NULL,
    `environment` ENUM('production', 'sandbox') NOT NULL DEFAULT 'sandbox',
    `publicConfig` TEXT NOT NULL,
    `privateConfig` TEXT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `version` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `creatorId` INTEGER UNSIGNED NOT NULL,
    `modifierId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderPayment` ADD CONSTRAINT `OrderPayment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_modifierId_fkey` FOREIGN KEY (`modifierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentConfig` ADD CONSTRAINT `PaymentConfig_paymentMethodId_fkey` FOREIGN KEY (`paymentMethodId`) REFERENCES `PaymentMethod`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentConfig` ADD CONSTRAINT `PaymentConfig_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentConfig` ADD CONSTRAINT `PaymentConfig_modifierId_fkey` FOREIGN KEY (`modifierId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
