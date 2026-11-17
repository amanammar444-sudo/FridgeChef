
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./prisma");
const recipeRoutes = require("./routes/recipeRoutes");
const shoppingListRoutes = require("./routes/shoppingListRoutes");
const uploadRoutes = require("./routes/uploadroutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/shopping-list", shoppingListRoutes);
app.use("/api/upload", uploadRoutes);

// Homepage
app.get("/", (req, res) => {
  res.json({
    message: "FridgeChef API is running!",
  });
});

// Database Health Check
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "API endpoint not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`FridgeChef server running on port ${PORT}`);
});