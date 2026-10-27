require("dotenv").config();

const prisma = require("./prisma");

async function testDatabase() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("Database error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();