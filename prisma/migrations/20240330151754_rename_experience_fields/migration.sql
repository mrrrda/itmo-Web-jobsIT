/*
  Warnings:

  - You are about to drop the column `experienceLevel` on the `Cv` table. All the data in the column will be lost.
  - You are about to drop the column `experienceLevel` on the `JobItem` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('INTERN', 'JUNIOR', 'MIDDLE', 'SENIOR', 'LEAD');

-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "experienceLevel",
ADD COLUMN     "experience" "Experience";

-- AlterTable
ALTER TABLE "JobItem" DROP COLUMN "experienceLevel",
ADD COLUMN     "experience" "Experience";

-- DropEnum
DROP TYPE "ExperienceLevel";
