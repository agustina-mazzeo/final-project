/*
  Warnings:

  - The primary key for the `Rate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Rate` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Rate_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Rate_created_at_idx" ON "Rate"("created_at");
