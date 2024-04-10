/*
  Warnings:

  - The `education` column on the `Cv` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `experienceLevel` column on the `Cv` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `experienceLevel` column on the `JobItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Education" AS ENUM ('BACHELORS', 'MASTERS');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('INTERN', 'JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD');

-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "education",
ADD COLUMN     "education" "Education",
DROP COLUMN "experienceLevel",
ADD COLUMN     "experienceLevel" "ExperienceLevel";

-- AlterTable
ALTER TABLE "JobItem" ADD COLUMN     "education" "Education",
DROP COLUMN "experienceLevel",
ADD COLUMN     "experienceLevel" "ExperienceLevel";
