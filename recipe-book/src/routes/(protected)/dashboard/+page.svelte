<script>
  import { supabase } from "$lib/supabaseClient";
  import { user } from "$lib/stores";

  let currentUser;
  user.subscribe((value) => (currentUser = value));

  const logout = async () => {
    await supabase.auth.signOut();
    user.set(null);
  };
</script>

{#if currentUser}
  <div>
    <span>Welcome, {currentUser.email}</span>
    <button on:click={logout}>Logout</button>
  </div>
{/if}
