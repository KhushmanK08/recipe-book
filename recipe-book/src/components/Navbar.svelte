<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { user } from "$lib/stores";

  let currentUser = null;
  let username = "";

  user.subscribe((val) => (currentUser = val));

  onMount(async () => {
    if (currentUser?.id) {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", currentUser.id)
        .single();

      if (!error && data) {
        username = data.username;
      } else {
        console.error("Error fetching username:", error);
      }
    }
  });

  const logout = async () => {
    await supabase.auth.signOut();
    user.set(null);
    window.location.href = "/login";
  };
</script>

<nav>
  <div class="left">
    <a href="/dashboard" class="brand-link">🍳 Recipe Book</a>
  </div>

  {#if currentUser}
    <div class="right">
      <span class="user-info">Hello, {username}</span>
      <a href="/profile" class="btn">Profile</a>
      <button on:click={logout}>Logout</button>
    </div>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 2rem;
    background-color: var(--primary);
    box-shadow: 0 0 20px var(--accent);
    color: var(--text);
    font-weight: bold;
    font-size: 1.1rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .left .brand-link {
    font-size: 1.5rem;
    color: var(--text);
    text-decoration: none;
    font-weight: bold;
  }

  .left .brand-link:hover {
    color: var(--accent);
  }

  .right {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .user-info {
    font-weight: 600;
    color: var(--text);
  }

  button,
  .btn {
    background-color: var(--accent);
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    font-weight: bold;
  }

  .btn:hover,
  button:hover {
    background-color: var(--text);
    color: var(--background);
  }

  @media (max-width: 600px) {
    nav {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .right {
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }
  }
</style>
