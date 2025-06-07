<script>
  import { supabase } from "$lib/supabaseClient";
  import { user } from "$lib/stores";

  let currentUser;
  user.subscribe((value) => (currentUser = value));

  const logout = async () => {
    await supabase.auth.signOut();
    user.set(null);
    window.location.href = "/login";
  };
</script>

<nav>
  {#if currentUser}
    <div class="user-email">Hello, {currentUser.email}</div>
    <button on:click={logout}>Logout</button>
  {/if}
</nav>

<style>
  nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: var(--primary);
    padding: 1rem 2rem;
    color: white;
  }

  .user-email {
    margin-right: 1.5rem;
    font-weight: 600;
  }

  button {
    background-color: var(--accent);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover {
    background-color: white;
    color: var(--primary);
  }
</style>
