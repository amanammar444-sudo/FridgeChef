const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET all shopping list items
router.get("/", async (req, res) => {
    try {
        const items = await prisma.shoppingListItem.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching shopping list:", error);
        res.status(500).json({
            message: "Failed to fetch shopping list",
        });
    }
});

// ADD an item to the shopping list
router.post("/", async (req, res) => {
    try {
        const { name, quantity } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Please provide an ingredient name.",
            });
        }

        const item = await prisma.shoppingListItem.create({
            data: {
                name: name.trim(),
                quantity:
                    typeof quantity === "string" && quantity.trim()
                        ? quantity.trim()
                        : null,
            },
        });

        res.status(201).json(item);
    } catch (error) {
        console.error("Error adding shopping list item:", error);
        res.status(500).json({
            message: "Failed to add shopping list item",
        });
    }
});

// MARK AN ITEM AS CHECKED OR UNCHECKED
router.patch("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { isChecked } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid item ID.",
            });
        }

        if (typeof isChecked !== "boolean") {
            return res.status(400).json({
                message: "isChecked must be true or false.",
            });
        }

        const item = await prisma.shoppingListItem.update({
            where: { id },
            data: { isChecked },
        });

        res.status(200).json(item);
    } catch (error) {
        console.error("Error updating shopping list item:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Shopping list item not found.",
            });
        }

        res.status(500).json({
            message: "Failed to update shopping list item",
        });
    }
});

// DELETE an item
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid item ID.",
            });
        }

        await prisma.shoppingListItem.delete({
            where: { id },
        });

        res.status(200).json({
            message: "Shopping list item deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting shopping list item:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Shopping list item not found.",
            });
        }

        res.status(500).json({
            message: "Failed to delete shopping list item",
        });
    }
});

module.exports = router;