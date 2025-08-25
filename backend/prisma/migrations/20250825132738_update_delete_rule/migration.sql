-- DropForeignKey
ALTER TABLE `productattribute` DROP FOREIGN KEY `ProductAttribute_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wholesale` DROP FOREIGN KEY `Wholesale_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wholesaledetail` DROP FOREIGN KEY `WholesaleDetail_wholesaleId_fkey`;

-- DropIndex
DROP INDEX `ProductAttribute_productId_fkey` ON `productattribute`;

-- DropIndex
DROP INDEX `WholesaleDetail_wholesaleId_fkey` ON `wholesaledetail`;

-- AddForeignKey
ALTER TABLE `ProductAttribute` ADD CONSTRAINT `ProductAttribute_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wholesale` ADD CONSTRAINT `Wholesale_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WholesaleDetail` ADD CONSTRAINT `WholesaleDetail_wholesaleId_fkey` FOREIGN KEY (`wholesaleId`) REFERENCES `Wholesale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
