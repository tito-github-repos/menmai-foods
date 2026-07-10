import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {

  // ── Admin ──────────────────────────────────────────
  const hashed = await bcrypt.hash("menmai@2026", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { password: hashed },
    create: {
      username: "admin",
      email: "menmaifoodsmdu@gmail.com",
      password: hashed,
    },
  });
  console.log("✅ Admin seeded");

  // ── Products ───────────────────────────────────────
  const chapathi = await prisma.product.upsert({
    where: { slug: "chapathi" },
    update: {
      name: "Chapathi",
      price: 40,
      mrp: 50,
      netWeight: "450g",
      pieces: 10,
      imageUrl: "/img/products/chapathi_main.webp",
      stockQuantity: 100,
      isActive: true,
    },
    create: {
      name: "Chapathi",
      slug: "chapathi",
      price: 40,
      mrp: 50,
      netWeight: "450g",
      pieces: 10,
      imageUrl: "/img/products/chapathi_main.webp",
      stockQuantity: 100,
      isActive: true,
    },
  });
  console.log("✅ Chapathi product seeded — ID:", chapathi.id);

  const poori = await prisma.product.upsert({
    where: { slug: "poori" },
    update: {
      name: "Poori",
      price: 45,
      mrp: 55,
      netWeight: "500g",
      pieces: 15,
      imageUrl: "/img/products/poori_main.webp",
      stockQuantity: 100,
      isActive: true,
    },
    create: {
      name: "Poori",
      slug: "poori",
      price: 45,
      mrp: 55,
      netWeight: "500g",
      pieces: 15,
      imageUrl: "/img/products/poori_main.webp",
      stockQuantity: 100,
      isActive: true,
    },
  });
  console.log("✅ Poori product seeded — ID:", poori.id);

  // ── Chapathi Images ────────────────────────────────
  await prisma.productImage.upsert({
    where: { id: 1 },
    update: {
      productId: chapathi.id,
      imageUrl: "/img/products/chapathi1.webp",
      altText: "chapathi_image_1",
      sortOrder: 1,
    },
    create: {
      productId: chapathi.id,
      imageUrl: "/img/products/chapathi1.webp",
      altText: "chapathi_image_1",
      sortOrder: 1,
    },
  });

  await prisma.productImage.upsert({
    where: { id: 2 },
    update: {
      productId: chapathi.id,
      imageUrl: "/img/products/chapathi2.webp",
      altText: "chapathi_image_2",
      sortOrder: 2,
    },
    create: {
      productId: chapathi.id,
      imageUrl: "/img/products/chapathi2.webp",
      altText: "chapathi_image_2",
      sortOrder: 2,
    },
  });
  console.log("✅ Chapathi images seeded");

  // ── Poori Images ───────────────────────────────────
  await prisma.productImage.upsert({
    where: { id: 3 },
    update: {
      productId: poori.id,
      imageUrl: "/img/products/poori1.webp",
      altText: "poori_image_1",
      sortOrder: 1,
    },
    create: {
      productId: poori.id,
      imageUrl: "/img/products/poori1.webp",
      altText: "poori_image_1",
      sortOrder: 1,
    },
  });

  await prisma.productImage.upsert({
    where: { id: 4 },
    update: {
      productId: poori.id,
      imageUrl: "/img/products/poori2.webp",
      altText: "poori_image_2",
      sortOrder: 2,
    },
    create: {
      productId: poori.id,
      imageUrl: "/img/products/poori2.webp",
      altText: "poori_image_2",
      sortOrder: 2,
    },
  });
  console.log("✅ Poori images seeded");

}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
