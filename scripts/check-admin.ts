
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log("Admin exists:", !!user);
  console.log("Role is ADMIN:", user?.role === "ADMIN");
  console.log(
    "Password matches:",
    user && password
      ? await bcrypt.compare(password, user.password)
      : false
  );
}

main()
  .catch(() => console.log("Check failed. Verify database connection."))
  .finally(() => prisma.$disconnect());