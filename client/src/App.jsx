import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/recipes";

function App() {
const [recipes, setRecipes] = useState([]);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
async function loadRecipes() {
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

loadRecipes();


}, []);

const filteredRecipes = recipes.filter((recipe) =>
recipe.name.toLowerCase().includes(search.toLowerCase())
);

return ( <div className="app"> <header className="navbar"> <a className="brand" href="/">
🥗 FridgeChef </a> <span className="tagline">Your fridge, your recipes.</span> </header>


  <main>
    <section className="hero">
      <p className="eyebrow">COOK SMARTER, WASTE LESS</p>
      <h1>
        What's in your <span>fridge?</span>
      </h1>
      <p className="hero-text">
        Discover delicious recipes and make every ingredient count.
      </p>

      <input
        className="search"
        type="search"
        placeholder="Search recipes by name..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </section>

    <section className="recipes-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR COLLECTION</p>
          <h2>Explore recipes</h2>
        </div>
        <span className="recipe-count">
          {filteredRecipes.length} recipes
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
            {search ? "No matching recipes" : "Your recipe book is empty"}
          </h3>
          <p>
            {search
              ? "Try another search term."
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
                <ul>
                  {(recipe.ingredients || []).map((item) => (
                    <li key={item.id}>
                      {item.ingredient?.name || "Ingredient"}
                      {item.quantity ? ` — ${item.quantity}` : ""}
                    </li>
                  ))}
                </ul>

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
  </main>

  <footer>
    <p>Made with 🥗 by FridgeChef</p>
    <p>Good food. Less waste.</p>
  </footer>
</div>


);
}

export default App;
