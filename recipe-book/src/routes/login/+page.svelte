<script>
  import { supabase } from "$lib/supabaseClient";
  let email = "";
  let password = "";
  let message = "";

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    message = error ? error.message : "Login successful!";
  };
</script>

<form on:submit|preventDefault={handleLogin}>
  <h2>Login</h2>
  <input type="email" placeholder="Email" bind:value={email} required />
  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
  />
  <button type="submit">Log In</button>
  {#if message}<p>{message}</p>{/if}
</form>
