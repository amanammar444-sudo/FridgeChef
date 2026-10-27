const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./prisma");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/recipes", recipeRoutes);

// Homepage
app.get("/", (req, res) => {
  res.json({
    message: "FridgeChef API is running!",
  });
});

// Database connection test
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "success",
      message: "PostgreSQL connected successfully!",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`FridgeChef server running at http://localhost:${PORT}`);
});