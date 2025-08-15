<script>
  export let recipe;
  export let onClose;
</script>

<div class="modal-backdrop" on:click={onClose}>
  <div class="modal-content" on:click|stopPropagation>
    <button class="close-btn" on:click={onClose}>×</button>
    <h2>{recipe.title}</h2>
    {#if recipe.image_url}
      <img src={recipe.image_url} alt={recipe.title} />
    {/if}
    <h3>Ingredients:</h3>
    <ul>
      {#each recipe.ingredients as ing}
        <li>{ing}</li>
      {/each}
    </ul>
    <h3>Instructions:</h3>
    <p>{recipe.instructions}</p>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background: var(--background);
    color: var(--text);
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--accent);
    color: var(--background);
    border: none;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
    cursor: pointer;
  }

  h2 {
    margin-top: 0;
    color: var(--accent);
  }

  img {
    width: 100%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 10px;
    margin: 1rem 0;
  }

  ul {
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.25rem;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: var(--accent);
  }
</style>
