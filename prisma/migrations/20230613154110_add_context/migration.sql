-- AlterTable
ALTER TABLE `telegramuser` MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `subscriptionType` ENUM('BASIC', 'PREMIUM', 'UNLIMITED') NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE `ContextMessage` (
    `id` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `contextId` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'assistant', 'system') NOT NULL,
    `text` TEXT NULL,
    `messageId` BIGINT NULL,
    `userId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContextMessage_messageId_idx`(`messageId`),
    INDEX `ContextMessage_userId_idx`(`userId`),
    INDEX `ContextMessage_contextId_idx`(`contextId`),
    UNIQUE INDEX `ContextMessage_messageId_key`(`messageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Context` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `chatId` BIGINT NOT NULL,
    `creatorId` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Context_creatorId_idx`(`creatorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContextMessage` ADD CONSTRAINT `ContextMessage_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextMessage` ADD CONSTRAINT `ContextMessage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `TelegramUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContextMessage` ADD CONSTRAINT `ContextMessage_contextId_fkey` FOREIGN KEY (`contextId`) REFERENCES `Context`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Context` ADD CONSTRAINT `Context_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `TelegramUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
