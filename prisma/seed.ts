import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("menmai@2026", 10);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: hashed },
    create: {
      username: "admin",
      password: hashed,
    },
  });

  console.log("✅ Admin updated successfully");
  console.log("   Username: admin");
  console.log("   Password: menmai@2026");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });