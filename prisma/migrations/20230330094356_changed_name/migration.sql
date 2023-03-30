/*
  Warnings:

  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `EmailVerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[token]` on the table `EmailVerificationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `ResetToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `EmailVerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `RefreshToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ResetToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Account` DROP COLUMN `expires_at`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `EmailVerificationToken` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `RefreshToken` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ResetToken` DROP PRIMARY KEY,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `EmailVerificationToken_token_key` ON `EmailVerificationToken`(`token`);

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_token_key` ON `RefreshToken`(`token`);

-- CreateIndex
CREATE UNIQUE INDEX `ResetToken_token_key` ON `ResetToken`(`token`);
