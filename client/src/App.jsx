import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/recipes";
const SHOPPING_API_URL = "http://localhost:5000/api/shopping-list";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Shopping list states
  const [shoppingItems, setShoppingItems] = useState([]);
  const [shoppingName, setShoppingName] = useState("");
  const [shoppingQuantity, setShoppingQuantity] = useState("");
  const [shoppingLoading, setShoppingLoading] = useState(false);
  const [shoppingError, setShoppingError] = useState("");
  const [shoppingSuccess, setShoppingSuccess] = useState("");

  // Load all recipes
  async function loadRecipes() {
    setLoading(true);
    setError("");
    setSearchMode(false);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error("Recipe loading error:", err);
      setError("Unable to load recipes. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  // Load shopping list
  async function loadShoppingItems() {
    setShoppingLoading(true);
    setShoppingError("");

    try {
      const response = await fetch(SHOPPING_API_URL);

      if (!response.ok) {
        throw new Error("Failed to load shopping list.");
      }

      const data = await response.json();
      setShoppingItems(data);
    } catch (err) {
      console.error("Shopping list loading error:", err);
      setShoppingError("Unable to load your shopping list.");
    } finally {
      setShoppingLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
    loadShoppingItems();
  }, []);

  // Search recipes by ingredients
  async function handleIngredientSearch(event) {
    event.preventDefault();

    if (!ingredientSearch.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchMode(true);
    setSearch("");

    try {
      const url = `${API_URL}/search?ingredients=${encodeURIComponent(
        ingredientSearch.trim()
      )}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ingredient search failed.");
      }

      setRecipes(data.recipes);
    } catch (err) {
      console.error("Ingredient search error:", err);
      setError(err.message || "Unable to search recipes.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  // Add an item to the shopping list
  async function handleAddShoppingItem(event) {
    event.preventDefault();

    if (!shoppingName.trim()) {
      setShoppingError("Please enter an ingredient name.");
      return;
    }

    setShoppingError("");
    setShoppingSuccess("");

    try {
      const response = await fetch(SHOPPING_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: shoppingName.trim(),
          quantity: shoppingQuantity.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add ingredient.");
      }

      setShoppingItems((previousItems) => [data, ...previousItems]);
      setShoppingName("");
      setShoppingQuantity("");
      setShoppingSuccess("Ingredient added successfully!");

      setTimeout(() => setShoppingSuccess(""), 2500);
    } catch (err) {
      console.error("Add shopping item error:", err);
      setShoppingError(err.message || "Unable to add ingredient.");
    }
  }

  // Mark an item as purchased or unpurchased
  async function handleToggleShoppingItem(item) {
    setShoppingError("");

    try {
      const response = await fetch(`${SHOPPING_API_URL}/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isChecked: !item.isChecked,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update ingredient.");
      }

      setShoppingItems((previousItems) =>
        previousItems.map((previousItem) =>
          previousItem.id === item.id ? data : previousItem
        )
      );
    } catch (err) {
      console.error("Update shopping item error:", err);
      setShoppingError(err.message || "Unable to update ingredient.");
    }
  }

  // Delete an item
  async function handleDeleteShoppingItem(id) {
    setShoppingError("");

    try {
      const response = await fetch(`${SHOPPING_API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete ingredient.");
      }

      setShoppingItems((previousItems) =>
        previousItems.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Delete shopping item error:", err);
      setShoppingError(err.message || "Unable to delete ingredient.");
    }
  }

  // Search recipes by name
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  );

  const purchasedCount = shoppingItems.filter(
    (item) => item.isChecked
  ).length;

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="/">
          🥗 FridgeChef
        </a>

        <span className="tagline">Your fridge, your recipes.</span>
      </header>

      <main>
        {/* Hero and search */}
        <section className="hero">
          <p className="eyebrow">COOK SMARTER, WASTE LESS</p>

          <h1>
            What's in your <span>fridge?</span>
          </h1>

          <p className="hero-text">
            Discover delicious recipes and make every ingredient count.
          </p>

          <form
            className="ingredient-search-form"
            onSubmit={handleIngredientSearch}
          >
            <label htmlFor="ingredient-search">
              Find recipes using your ingredients
            </label>

            <input
              id="ingredient-search"
              className="search"
              type="text"
              placeholder="Enter ingredients: egg, tomato, onion"
              value={ingredientSearch}
              onChange={(event) =>
                setIngredientSearch(event.target.value)
              }
            />

            <button className="search-button" type="submit">
              🔍 Find Recipes
            </button>
          </form>

          <p className="search-help">
            Separate ingredients with commas. For example: egg, tomato
          </p>

          <div className="name-search">
            <label htmlFor="recipe-search">
              Or search by recipe name
            </label>

            <input
              id="recipe-search"
              className="search"
              type="search"
              placeholder="Search recipes by name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {searchMode && (
            <button
              className="clear-search-button"
              type="button"
              onClick={() => {
                setIngredientSearch("");
                setSearch("");
                loadRecipes();
              }}
            >
              Show All Recipes
            </button>
          )}
        </section>

        {/* Recipe collection */}
        <section className="recipes-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {searchMode ? "INGREDIENT MATCHES" : "YOUR COLLECTION"}
              </p>

              <h2>
                {searchMode ? "Recipes you can make" : "Explore recipes"}
              </h2>
            </div>

            <span className="recipe-count">
              {loading ? "Searching..." : `${filteredRecipes.length} recipes`}
            </span>
          </div>

          {loading ? (
            <p className="status">Loading recipes...</p>
          ) : error ? (
            <p className="status error">{error}</p>
          ) : filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍳</div>

              <h3>
                {searchMode
                  ? "No matching recipes found"
                  : search
                    ? "No matching recipes"
                    : "Your recipe book is empty"}
              </h3>

              <p>
                {searchMode
                  ? "Try different ingredients, or add those ingredients to your recipes first."
                  : search
                    ? "Try another recipe name."
                    : "Add recipes to your database and they will appear here."}
              </p>
            </div>
          ) : (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe) => (
                <article className="recipe-card" key={recipe.id}>
                  {recipe.imageUrl ? (
                    <img
                      className="recipe-image"
                      src={recipe.imageUrl}
                      alt={recipe.name}
                    />
                  ) : (
                    <div className="recipe-placeholder">🥘</div>
                  )}

                  <div className="recipe-content">
                    <span className="cook-time">
                      ⏱ {recipe.cookingTime} minutes
                    </span>

                    <h3>{recipe.name}</h3>

                    <p>
                      {recipe.description || "A delicious recipe to try."}
                    </p>

                    <h4>Ingredients</h4>

                    {recipe.ingredients?.length > 0 ? (
                      <ul>
                        {recipe.ingredients.map((item) => (
                          <li key={item.id}>
                            {item.ingredient?.name || "Ingredient"}
                            {item.quantity ? ` — ${item.quantity}` : ""}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Ingredients have not been added yet.</p>
                    )}

                    <details>
                      <summary>View instructions</summary>
                      <p className="instructions">{recipe.instructions}</p>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Shopping list */}
        <section className="shopping-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR GROCERY CHECKLIST</p>
              <h2>🛒 Shopping List</h2>
              <p className="shopping-description">
                Keep track of the ingredients you need.
              </p>
            </div>

            <span className="recipe-count">
              {purchasedCount}/{shoppingItems.length} purchased
            </span>
          </div>

          <form
            className="shopping-form"
            onSubmit={handleAddShoppingItem}
          >
            <input
              type="text"
              aria-label="Ingredient name"
              placeholder="Ingredient name, e.g. tomatoes"
              value={shoppingName}
              onChange={(event) => setShoppingName(event.target.value)}
            />

            <input
              type="text"
              aria-label="Ingredient quantity"
              placeholder="Quantity, e.g. 500 g"
              value={shoppingQuantity}
              onChange={(event) => setShoppingQuantity(event.target.value)}
            />

            <button type="submit">+ Add Item</button>
          </form>

          {shoppingError && (
            <p className="status error">{shoppingError}</p>
          )}

          {shoppingSuccess && (
            <p className="shopping-success">{shoppingSuccess}</p>
          )}

          {shoppingLoading ? (
            <p className="status">Loading shopping list...</p>
          ) : shoppingItems.length === 0 ? (
            <div className="shopping-empty">
              <span>🥬</span>
              <p>Your shopping list is empty.</p>
              <p>Add ingredients you need to buy!</p>
            </div>
          ) : (
            <ul className="shopping-list">
              {shoppingItems.map((item) => (
                <li
                  className={`shopping-item ${item.isChecked ? "purchased" : ""
                    }`}
                  key={item.id}
                >
                  <label className="shopping-item-label">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      onChange={() => handleToggleShoppingItem(item)}
                    />

                    <span className="shopping-item-name">
                      {item.name}
                    </span>

                    {item.quantity && (
                      <span className="shopping-item-quantity">
                        {item.quantity}
                      </span>
                    )}
                  </label>

                  <button
                    className="delete-shopping-item"
                    type="button"
                    onClick={() => handleDeleteShoppingItem(item.id)}
                    aria-label={`Delete ${item.name}`}
                    title="Delete item"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer>
        <p>Made with 🥗 by FridgeChef</p>
        <p>Good food. Less waste.</p>
      </footer>
    </div>
  );
}

export default App;