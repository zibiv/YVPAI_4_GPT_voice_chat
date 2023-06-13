/*
  Warnings:

  - You are about to drop the column `subscription` on the `telegramuser` table. All the data in the column will be lost.
  - Added the required column `createdChatId` to the `TelegramUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `TelegramUser_userId_key` ON `telegramuser`;

-- AlterTable
ALTER TABLE `telegramuser` DROP COLUMN `subscription`,
    ADD COLUMN `createdChatId` BIGINT NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `subscriptionType` ENUM('BASIC', 'PREMIUM', 'UNLIMITED') NOT NULL DEFAULT 'BASIC',
    MODIFY `userId` VARCHAR(191) NULL;
