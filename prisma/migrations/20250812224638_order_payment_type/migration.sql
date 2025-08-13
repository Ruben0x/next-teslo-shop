-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('webpay', 'paypal');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'webpay';
