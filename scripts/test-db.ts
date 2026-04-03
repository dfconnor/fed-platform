import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const order = await prisma.order.findFirst({
    select: { id: true, orderNumber: true, total: true, status: true, paymentStatus: true },
    orderBy: { createdAt: "desc" },
  });
  console.log("Latest order:", JSON.stringify(order, null, 2));

  const count = await prisma.order.count();
  console.log("Total orders:", count);

  await prisma.$disconnect();
}

main().catch(console.error);
