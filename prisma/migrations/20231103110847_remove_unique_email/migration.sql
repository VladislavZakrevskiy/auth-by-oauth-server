/*
  Warnings:

  - You are about to drop the column `created_ad` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updated_ay` on the `Document` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "created_ad",
DROP COLUMN "updated_ay",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
