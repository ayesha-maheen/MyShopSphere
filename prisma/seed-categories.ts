
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL nahi mili. Project ki root .env file check karo."
  );
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

const categoryData: Record<string, string[]> = {
  Women: [
    "Clothing",
    "Shoes",
    "Bags",
    "Accessories",
    "Jewelry",
  ],
  Men: [
    "Clothing",
    "Shoes",
    "Bags",
    "Accessories",
    "Watches",
  ],
  Kids: [
    "Clothing",
    "Shoes",
    "Accessories",
    "Toys",
  ],
  Electronics: [
    "Mobiles",
    "Laptops",
    "Headphones",
    "Accessories",
  ],
};

async function main() {
  for (const [parentName, subcategories] of Object.entries(categoryData)) {
    const parent = await prisma.category.upsert({
      where: { name: parentName },
      update: {},
      create: {
        name: parentName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    for (const subcategoryName of subcategories) {
      const fullName = `${parentName} - ${subcategoryName}`;

      await prisma.category.upsert({
        where: { name: fullName },
        update: {
          parentId: parent.id,
        },
        create: {
          name: fullName,
          parentId: parent.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log("All categories and subcategories added successfully!");
}

main()
  .catch((error) => {
    console.error("Category seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });