/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Transfer` DROP FOREIGN KEY `Transfer_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `Transfer` DROP FOREIGN KEY `Transfer_cardId_fkey`;

-- DropForeignKey
ALTER TABLE `_CategoryToTransfer` DROP FOREIGN KEY `_CategoryToTransfer_A_fkey`;

-- DropIndex
DROP INDEX `Transfer_accountId_fkey` ON `Transfer`;

-- DropIndex
DROP INDEX `Transfer_cardId_fkey` ON `Transfer`;

-- AlterTable
ALTER TABLE `Account` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Card` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Category` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Transfer` MODIFY `accountId` VARCHAR(191) NULL,
    MODIFY `cardId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `_CategoryToTransfer` MODIFY `A` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToTransfer` ADD CONSTRAINT `_CategoryToTransfer_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
