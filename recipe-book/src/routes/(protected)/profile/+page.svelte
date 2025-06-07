<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let userProfile = null;
  let savedRecipes = [];
  let postedRecipes = [];
  let loading = true;
  let error = "";

  async function fetchProfile() {
    loading = true;
    error = "";

    // Updated: get current user async
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      goto("/login");
      return;
    }

    try {
      // Fetch user info from "users" table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, full_name, email")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      userProfile = profile;

      // Fetch saved/favorited recipes joining favorites with recipes
      const { data: saved, error: savedError } = await supabase
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

      if (savedError) throw savedError;
      savedRecipes = saved.map((s) => s.recipes);

      // Fetch recipes posted by user
      const { data: posted, error: postedError } = await supabase
        .from("recipes")
        .select("id, title, description, image_url")
        .eq("user_id", user.id);

      if (postedError) throw postedError;
      postedRecipes = posted;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchProfile();
  });

  const logout = async () => {
    await supabase.auth.signOut();
    goto("/login");
  };
</script>

{#if loading}
  <p>Loading profile...</p>
{:else if error}
  <p class="error">{error}</p>
{:else}
  <section class="profile-container">
    <div class="profile-info">
      <h2>{userProfile.full_name}</h2>
      <p><strong>Username:</strong> {userProfile.username}</p>
      <p><strong>Email:</strong> {userProfile.email}</p>
      <button on:click={logout}>Logout</button>
    </div>

    <div class="recipes-section">
      <h3>Saved Recipes</h3>
      {#if savedRecipes.length === 0}
        <p>You have no saved recipes yet.</p>
      {:else}
        <ul>
          {#each savedRecipes as recipe}
            <li>
              <strong>{recipe.title}</strong>: {recipe.description}
              {#if recipe.image_url}
                <br />
                <img src={recipe.image_url} alt={recipe.title} width="150" />
              {/if}
            </li>
          {/each}
        </ul>
      {/if}

      <h3>Your Posted Recipes</h3>
      {#if postedRecipes.length === 0}
        <p>You haven’t posted any recipes yet.</p>
      {:else}
        <ul>
          {#each postedRecipes as recipe}
            <li>
              <strong>{recipe.title}</strong>: {recipe.description}
              {#if recipe.image_url}
                <br />
                <img src={recipe.image_url} alt={recipe.title} width="150" />
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>
{/if}

<style>
  /* Mocha Delight theme CSS variables (make sure they exist in your global CSS) */
  /* 
  --background: #F3E9DC;
  --primary: #C3B091;
  --accent: #8E806A;
  --text: #2E2E2E;
  */

  .profile-container {
    max-width: 800px;
    margin: 3rem auto;
    background: var(--background);
    color: var(--text);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(140, 121, 91, 0.15);
    font-family: "Segoe UI", sans-serif;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .profile-info {
    background: var(--primary);
    padding: 1.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 0 8px var(--accent);
    color: var(--text);
    text-align: center;
  }

  .profile-info h2 {
    margin-bottom: 0.5rem;
  }

  .profile-info p {
    margin: 0.25rem 0;
  }

  .profile-info button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: var(--accent);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    color: var(--background);
    transition: background 0.3s ease;
  }

  .profile-info button:hover {
    background: var(--primary);
    color: var(--text);
  }

  .recipes-section {
    background: var(--primary);
    border-radius: 12px;
    padding: 1.5rem 2rem;
    box-shadow: 0 0 10px var(--accent);
    color: var(--text);
  }

  .recipes-section h3 {
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    margin-bottom: 2rem;
  }

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--accent);
  }

  li img {
    margin-top: 0.5rem;
    border-radius: 8px;
  }

  p.error {
    color: red;
    text-align: center;
  }

  @media (max-width: 600px) {
    .profile-container {
      padding: 1rem;
    }

    .profile-info,
    .recipes-section {
      padding: 1rem;
    }
  }
</style>
