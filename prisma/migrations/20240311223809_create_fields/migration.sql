/*
  Warnings:

  - Added the required column `description` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceLevel` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minSalary` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Cv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT;

-- AlterTable
ALTER TABLE "Cv" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "education" TEXT NOT NULL,
ADD COLUMN     "experienceLevel" TEXT NOT NULL,
ADD COLUMN     "maxSalary" INTEGER,
ADD COLUMN     "minSalary" INTEGER NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "workPlace" "WorkPlace" NOT NULL DEFAULT 'OFFICE',
ADD COLUMN     "workSchedule" "WorkSchedule" NOT NULL DEFAULT 'FIXED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
