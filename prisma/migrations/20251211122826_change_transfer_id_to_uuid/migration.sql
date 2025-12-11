/*
  Warnings:

  - The primary key for the `Transfer` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_CategoryToTransfer` DROP FOREIGN KEY `_CategoryToTransfer_B_fkey`;

-- AlterTable
ALTER TABLE `Transfer` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `_CategoryToTransfer` MODIFY `B` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `_CategoryToTransfer` ADD CONSTRAINT `_CategoryToTransfer_B_fkey` FOREIGN KEY (`B`) REFERENCES `Transfer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
