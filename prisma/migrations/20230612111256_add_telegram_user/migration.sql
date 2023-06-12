-- CreateTable
CREATE TABLE `TelegramUser` (
    `id` BIGINT NOT NULL,
    `username` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `subscription` ENUM('BASIC', 'PRO', 'UNLIM') NOT NULL DEFAULT 'BASIC',
    `startFlag` BOOLEAN NOT NULL DEFAULT false,
    `timeoutUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TelegramUser_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
