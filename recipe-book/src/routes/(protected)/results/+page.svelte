<script>
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import ViewRecipeModal from "../../../components/ViewRecipeModal.svelte";
  import Navbar from "../../../components/Navbar.svelte";

  let query = "";
  let results = [];
  let selectedRecipe = null;
  let newSearch = "";

  async function fetchRecipes(q) {
    if (!q) return;
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`,
      );
      const data = await res.json();

      results =
        data.meals?.map((meal) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image_url: meal.strMealThumb,
          ingredients: Object.keys(meal)
            .filter((k) => k.startsWith("strIngredient") && meal[k])
            .map((k) => meal[k])
            .filter((i) => i),
        })) || [];
    } catch (e) {
      console.error(e);
      results = [];
    }
  }

  onMount(() => {
    query = new URLSearchParams(window.location.search).get("q") || "";
    fetchRecipes(query);

    const unsubscribe = page.subscribe(($page) => {
      const q = $page.url.searchParams.get("q") || "";
      if (q !== query) {
        query = q;
        fetchRecipes(query);
      }
    });

    onDestroy(() => unsubscribe());
  });

  function handleSearch() {
    if (!newSearch.trim()) return;
    window.history.pushState(
      {},
      "",
      `/results?q=${encodeURIComponent(newSearch)}`,
    );
    query = newSearch;
    fetchRecipes(query);
  }
</script>

<Navbar />

<div class="results-container">
  <div class="search-section">
    <input
      type="text"
      bind:value={newSearch}
      placeholder="Search more recipes..."
    />
    <button class="btn" on:click={handleSearch}>Search</button>
    <button class="btn back-btn" on:click={() => goto("/dashboard")}
      >← Back</button
    >
  </div>

  <h2>Results for "{query}"</h2>

  {#if results.length === 0}
    <p style="text-align:center; color: var(--text)">No results found.</p>
  {:else}
    <div class="results-list">
      {#each results as recipe}
        <div class="recipe-item" on:click={() => (selectedRecipe = recipe)}>
          <div class="recipe-image">
            <img src={recipe.image_url} alt={recipe.title} />
          </div>
          <div class="recipe-info">
            <h3>{recipe.title}</h3>
            <p>
              <strong>Ingredients:</strong>
              {recipe.ingredients.length} items
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if selectedRecipe}
    <ViewRecipeModal
      recipe={selectedRecipe}
      on:close={() => (selectedRecipe = null)}
    />
  {/if}
</div>

<style>
  body,
  input,
  button {
    font-family: "Poppins", sans-serif;
  }

  .results-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  .search-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-section input {
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--accent);
    width: 280px;
    font-size: 1rem;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    border: none;
    background: var(--accent);
    color: var(--background);
    font-weight: bold;
    cursor: pointer;
    transition:
      background 0.3s ease,
      transform 0.2s ease;
  }

  .btn:hover {
    background: var(--primary);
    color: var(--text);
    transform: translateY(-2px);
  }

  .back-btn {
    background: var(--primary);
  }

  h2 {
    color: var(--accent);
    font-weight: 700;
    margin-bottom: 1rem;
    text-align: center;
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .recipe-item {
    display: flex;
    gap: 1rem;
    background: var(--primary);
    border-radius: 14px;
    padding: 1rem;
    cursor: pointer;
    align-items: center;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .recipe-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .recipe-image img {
    width: 160px;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
  }

  .recipe-info h3 {
    margin: 0;
    color: var(--accent);
    font-size: 1.2rem;
  }

  .recipe-info p {
    margin-top: 0.5rem;
    color: var(--text);
    font-size: 0.95rem;
  }

  @media (max-width: 600px) {
    .recipe-item {
      flex-direction: column;
      align-items: flex-start;
    }
    .recipe-image img {
      width: 100%;
      height: auto;
    }
  }
</style>
