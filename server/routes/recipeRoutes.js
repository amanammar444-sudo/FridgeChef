
const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({
      message: "Failed to fetch recipes",
      error: error.message,
    });
  }
});

// GET one recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid recipe ID" });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return res.status(500).json({
      message: "Failed to fetch recipe",
      error: error.message,
    });
  }
});

// POST create a recipe
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      instructions,
      cookingTime,
      imageUrl,
      ingredients = [],
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof instructions !== "string" ||
      !instructions.trim() ||
      !Number.isInteger(Number(cookingTime)) ||
      Number(cookingTime) <= 0 ||
      !Array.isArray(ingredients)
    ) {
      return res.status(400).json({
        message:
          "Provide name, instructions, a positive cookingTime, and an ingredients array.",
      });
    }

    const recipe = await prisma.recipe.create({
      data: {
        name: name.trim(),
        description: description || null,
        instructions: instructions.trim(),
        cookingTime: Number(cookingTime),
        imageUrl: imageUrl || null,
        ingredients: {
          create: ingredients
            .filter((item) => item && typeof item.name === "string" && item.name.trim())
            .map((item) => ({
              quantity: item.quantity || null,
              ingredient: {
                connectOrCreate: {
                  where: {
                    name: item.name.trim(),
                  },
                  create: {
                    name: item.name.trim(),
                  },
                },
              },
            })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return res.status(201).json(recipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({
      message: "Failed to create recipe",
      error: error.message,
    });
  }
});

module.exports = router;

