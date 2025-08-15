<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import Navbar from "../../../components/Navbar.svelte";
  import ViewRecipeModal from "../../../components/ViewRecipeModal.svelte";
  import { goto } from "$app/navigation";

  let savedRecipes = [];
  let selectedRecipe = null;
  let loading = true;
  let error = "";

  onMount(async () => {
    loading = true;
    error = "";

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        goto("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("favorites")
        .select(
          `
          recipe_id,
          recipes (
            id,
            title,
            description,
            image_url
          )
        `,
        )
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;

      savedRecipes = data.map((d) => d.recipes);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function openRecipeModal(recipe) {
    selectedRecipe = recipe;
  }

  function closeRecipeModal() {
    selectedRecipe = null;
  }
</script>

<Navbar />

<div class="saved-container">
  <h2>Your Saved Recipes</h2>

  {#if loading}
    <p>Loading saved recipes...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if savedRecipes.length === 0}
    <p>You haven’t saved any recipes yet.</p>
  {:else}
    <div class="recipe-grid">
      {#each savedRecipes as recipe}
        <div class="recipe-card" on:click={() => openRecipeModal(recipe)}>
          {#if recipe.image_url}
            <img src={recipe.image_url} alt={recipe.title} />
          {/if}
          <h3>{recipe.title}</h3>
          <p>{recipe.description?.substring(0, 100)}...</p>
        </div>
      {/each}
    </div>
  {/if}

  {#if selectedRecipe}
    <ViewRecipeModal recipe={selectedRecipe} on:close={closeRecipeModal} />
  {/if}
</div>

<style>
  .saved-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 1rem;
  }

  h2 {
    text-align: center;
    color: var(--accent);
    margin-bottom: 1.5rem;
  }

  .recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .recipe-card {
    background: var(--primary);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .recipe-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .recipe-card img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
  }

  .recipe-card h3 {
    margin: 0.5rem 0 0.25rem;
    color: var(--accent);
  }

  .recipe-card p {
    margin: 0;
    color: var(--text);
    font-size: 0.95rem;
  }

  p.error {
    color: red;
    text-align: center;
  }
</style>
