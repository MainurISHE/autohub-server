/*
  Warnings:

  - You are about to drop the column `image` on the `Brand` table. All the data in the column will be lost.
  - Added the required column `logo` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "image",
ADD COLUMN     "logo" TEXT NOT NULL;
