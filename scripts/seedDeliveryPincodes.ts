// scripts/seedDeliveryPincodes.ts
// Run once with: npx tsx scripts/seedDeliveryPincodes.ts

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const PINCODES = Array.from({ length: 21 }, (_, i) =>
  String(625001 + i)
); // ["625001", "625002", ..., "625021"]

async function seed() {
  console.log("🌱 Starting delivery pincode seed...\n");

  for (const pincode of PINCODES) {
    await prisma.deliveryPincode.upsert({
      where: { pincode },
      update: { isActive: true },
      create: { pincode, isActive: true },
    });

    console.log(`✅ ${pincode} seeded`);
  }

  console.log("\n✅ Seeding complete.");
  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});