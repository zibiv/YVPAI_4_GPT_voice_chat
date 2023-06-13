-- AlterTable
ALTER TABLE `telegramuser` MODIFY `createdChatId` BIGINT NULL,
    MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `subscriptionType` ENUM('BASIC', 'PREMIUM', 'UNLIMITED') NOT NULL DEFAULT 'BASIC';
