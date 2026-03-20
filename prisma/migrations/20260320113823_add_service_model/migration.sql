/*
  Warnings:

  - You are about to drop the column `defaultRate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `issueDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledStart` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `month` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hours` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "defaultRate",
DROP COLUMN "serviceType",
DROP COLUMN "status",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "dueDate",
DROP COLUMN "issueDate",
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'unpaid';

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "durationMinutes",
DROP COLUMN "rate",
DROP COLUMN "scheduledStart",
DROP COLUMN "status",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "hours" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
