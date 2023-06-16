/*
  Warnings:

  - You are about to drop the `tests` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `telegramuser` MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `subscriptionType` ENUM('BASIC', 'PREMIUM', 'UNLIMITED') NOT NULL DEFAULT 'BASIC';

-- DropTable
DROP TABLE `tests`;
