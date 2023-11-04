/*
  Warnings:

  - Added the required column `providers` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Providers" AS ENUM ('GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "providers" JSONB NOT NULL,
ADD COLUMN     "providers_list" "Providers"[];
