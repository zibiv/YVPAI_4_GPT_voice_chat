-- AlterTable
ALTER TABLE `telegramuser` MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `subscriptionType` ENUM('BASIC', 'PREMIUM', 'UNLIMITED') NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE `tests` (
    `id` VARCHAR(191) NOT NULL,
    `name_of_test` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
