const prisma = require("./prisma");

async function main() {
    const recipes = [
        {
            name: "Tomato Omelette",
            description: "A quick and easy tomato omelette.",
            instructions:
                "1. Beat the eggs. 2. Chop the tomatoes. 3. Mix with salt. 4. Cook in a pan until done.",
            cookingTime: 10,
            ingredients: [
                { name: "egg", quantity: "2" },
                { name: "tomato", quantity: "1" },
                { name: "salt", quantity: "To taste" },
            ],
        },
        {
            name: "Vegetable Fried Rice",
            description: "Simple fried rice with vegetables.",
            instructions:
                "1. Cook the rice. 2. Chop the vegetables. 3. Stir-fry the vegetables. 4. Add rice and seasoning.",
            cookingTime: 20,
            ingredients: [
                { name: "rice", quantity: "1 cup" },
                { name: "carrot", quantity: "1" },
                { name: "onion", quantity: "1" },
            ],
        },
        {
            name: "Banana Pancakes",
            description: "Soft pancakes made with bananas.",
            instructions:
                "1. Mash the bananas. 2. Mix with eggs and flour. 3. Pour into a hot pan. 4. Cook both sides.",
            cookingTime: 15,
            ingredients: [
                { name: "banana", quantity: "1" },
                { name: "egg", quantity: "1" },
                { name: "flour", quantity: "1 cup" },
            ],
        },
    ];

    for (const recipeData of recipes) {
        const { ingredients, ...recipe } = recipeData;

        const existingRecipe = await prisma.recipe.findFirst({
            where: { name: recipe.name },
        });

        const ingredientData = ingredients.map((item) => ({
            quantity: item.quantity,
            ingredient: {
                connectOrCreate: {
                    where: { name: item.name },
                    create: { name: item.name },
                },
            },
        }));

        if (existingRecipe) {
            await prisma.recipe.update({
                where: { id: existingRecipe.id },
                data: {
                    description: recipe.description,
                    instructions: recipe.instructions,
                    cookingTime: recipe.cookingTime,
                    ingredients: {
                        deleteMany: {},
                        create: ingredientData,
                    },
                },
            });
        } else {
            await prisma.recipe.create({
                data: {
                    ...recipe,
                    ingredients: {
                        create: ingredientData,
                    },
                },
            });
        }
    }

    console.log("Recipes and ingredients added successfully!");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });