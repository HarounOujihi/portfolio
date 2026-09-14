/*
  Warnings:

  - Added the required column `summary` to the `JobMatchAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobMatchAnalysis" ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;
