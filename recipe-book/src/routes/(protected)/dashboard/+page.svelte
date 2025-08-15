<script>
  import Navbar from "../../../components/Navbar.svelte";
  import AddRecipeModal from "../../../components/AddRecipeModal.svelte";
  import { onMount } from "svelte";

  let showSearch = false;
  let searchQuery = "";
  let showAddModal = false;
  let randomRecipes = [];

  function toggleSearch() {
    showSearch = !showSearch;
  }

  function openAddRecipe() {
    showAddModal = true;
  }

  function searchRecipes() {
    if (!searchQuery.trim()) return;
    window.location.href = `/results?q=${encodeURIComponent(searchQuery)}`;
  }

  async function fetchRandomRecipe() {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/random.php`,
      );
      const data = await res.json();
      const meal = data.meals[0];
      return {
        id: meal.idMeal,
        title: meal.strMeal,
        image_url: meal.strMealThumb,
        ingredients: Object.keys(meal)
          .filter((k) => k.startsWith("strIngredient") && meal[k])
          .map((k) => meal[k]),
        instructions: meal.strInstructions,
      };
    } catch (e) {
      console.error("Error fetching random recipe:", e);
      return null;
    }
  }

  async function fetchRandomRecipes() {
    const promises = Array.from({ length: 4 }, () => fetchRandomRecipe());
    randomRecipes = (await Promise.all(promises)).filter(Boolean);
  }

  async function refreshRecipe(index) {
    const newRecipe = await fetchRandomRecipe();
    if (newRecipe) randomRecipes[index] = newRecipe;
  }

  onMount(fetchRandomRecipes);
</script>

<Navbar />

<div class="dashboard-container">
  <div class="action-row">
    <button class="btn large-btn" on:click={toggleSearch}>🔍 Search</button>
    <button class="btn large-btn" on:click={openAddRecipe}>➕ Add Recipe</button
    >
    <button
      class="btn large-btn"
      on:click={() => (window.location.href = "/SavedRecipes")}
      >💾 Saved Recipes</button
    >
  </div>

  {#if showSearch}
    <div class="search-box">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search recipes..."
      />
      <button class="btn" on:click={searchRecipes}>Go</button>
    </div>
  {/if}

  <section>
    <h2>Random Recipes</h2>
    <div class="recipe-grid">
      {#each randomRecipes as recipe, i}
        <div class="recipe-card">
          <div class="recipe-image">
            {#if recipe.image_url}
              <img src={recipe.image_url} alt={recipe.title} />
            {/if}
          </div>
          <div class="recipe-info">
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p style="font-style: italic; margin-top: 0.5rem;">
              Save to view instructions
            </p>
            <button class="save-btn" on:click={() => refreshRecipe(i)}
              >Save Recipe</button
            >
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

{#if showAddModal}
  <AddRecipeModal on:close={() => (showAddModal = false)} />
{/if}

<style>
  .dashboard-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .action-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .btn {
    background: var(--accent);
    color: var(--background);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition:
      background 0.3s ease,
      transform 0.2s ease;
  }

  .btn:hover {
    background: var(--primary);
    color: var(--text);
    transform: translateY(-2px);
  }

  .large-btn {
    padding: 1rem 2rem;
    font-size: 1.25rem;
  }

  .search-box {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-box input {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--accent);
    width: 300px;
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
  }

  .recipe-card {
    display: flex;
    background: var(--primary);
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    flex-direction: column;
    padding: 1rem;
  }

  .recipe-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .recipe-image img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
  }

  .recipe-info h3 {
    margin: 0.5rem 0;
    color: var(--accent);
    font-size: 1.5rem;
  }

  .recipe-info h4 {
    margin: 0.5rem 0 0.25rem;
    color: var(--accent);
  }

  .recipe-info ul {
    padding-left: 1.25rem;
    margin: 0.25rem 0 0.5rem;
  }

  .recipe-info li {
    margin-bottom: 0.25rem;
  }

  .recipe-info p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: var(--text);
  }

  .save-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 10px;
    background: var(--accent);
    color: var(--background);
    font-weight: bold;
    cursor: pointer;
  }

  .save-btn:hover {
    background: var(--primary);
    color: var(--text);
  }
</style>
