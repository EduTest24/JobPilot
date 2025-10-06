/*
  Warnings:

  - Changed the type of `salaryRanges` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `recommendedSkills` on the `IndustryInsight` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "IndustryInsight" DROP COLUMN "salaryRanges",
ADD COLUMN     "salaryRanges" JSONB NOT NULL,
DROP COLUMN "recommendedSkills",
ADD COLUMN     "recommendedSkills" JSONB NOT NULL;
