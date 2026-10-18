-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `customerName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'COD',
    ADD COLUMN `phone` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
