<script>
  import { createEventDispatcher } from "svelte";
  import { supabase } from "$lib/supabaseClient";

  export let recipe = null; // Pass recipe object: {id, title, description, ingredients, instructions, image_url}
  const dispatch = createEventDispatcher();

  let saving = false;
  let message = "";

  async function saveRecipe() {
    saving = true;
    message = "";

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      message = "You must be logged in.";
      saving = false;
      return;
    }

    try {
      const { error } = await supabase
        .from("favorites")
        .upsert({ user_id: user.id, recipe_id: recipe.id });

      if (error) throw error;
      message = "Recipe saved successfully!";
    } catch (e) {
      message = e.message;
    } finally {
      saving = false;
    }
  }
</script>

<div class="modal-backdrop" on:click={() => dispatch("close")}></div>

<div class="modal">
  <h2>{recipe.title}</h2>

  {#if recipe.image_url}
    <img src={recipe.image_url} alt={recipe.title} />
  {/if}

  <p><strong>Description:</strong> {recipe.description}</p>

  {#if recipe.ingredients?.length}
    <p><strong>Ingredients:</strong></p>
    <ul>
      {#each recipe.ingredients as ing}
        <li>{ing}</li>
      {/each}
    </ul>
  {/if}

  {#if recipe.instructions?.length}
    <p><strong>Instructions:</strong></p>
    <ol>
      {#each recipe.instructions as step}
        <li>{step}</li>
      {/each}
    </ol>
  {/if}

  {#if message}
    <p class="message">{message}</p>
  {/if}

  <div class="actions">
    <button class="cancel" on:click={() => dispatch("close")}>Close</button>
    <button class="save" on:click={saveRecipe} disabled={saving}>
      {saving ? "Saving..." : "Save Recipe"}
    </button>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--background);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
    color: var(--text);
    overflow-y: auto;
    max-height: 80vh;
  }
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--accent);
  }
  img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  ul,
  ol {
    margin: 0.5rem 0 1rem 1rem;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  .save {
    background: var(--accent);
    color: var(--background);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }
  .save:hover {
    background: var(--primary);
    color: var(--text);
  }
  .cancel {
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--text);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
  }
  .cancel:hover {
    background: var(--primary);
  }
  .message {
    margin-top: 0.5rem;
    color: green;
  }
</style>
