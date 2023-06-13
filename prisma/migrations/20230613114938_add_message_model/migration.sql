-- AlterTable
ALTER TABLE `telegramuser` MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `subscriptionType` ENUM('BASIC', 'PREMIUM', 'UNLIMITED') NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE `Message` (
    `id` BIGINT NOT NULL,
    `fromUserId` BIGINT NOT NULL,
    `chatId` BIGINT NOT NULL,
    `text` TEXT NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Message_fromUserId_idx`(`fromUserId`),
    UNIQUE INDEX `Message_chatId_id_key`(`chatId`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `TelegramUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
