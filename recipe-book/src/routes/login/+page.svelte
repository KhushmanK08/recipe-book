<script>
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";

  let email = "";
  let password = "";
  let message = "";

  const handleLogin = async () => {
    message = "";
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      message = error.message;
    } else {
      goto("/dashboard");
    }
  };

  const goToSignup = () => goto("/signup");
</script>

<form on:submit|preventDefault={handleLogin} in:fly={{ y: 30 }} class="form">
  <h2 in:fade>Login</h2>
  <input type="email" placeholder="Email" bind:value={email} required />
  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
  />
  <button type="submit">Log In</button>
  <p class="link" on:click={goToSignup}>Don’t have an account? Sign up</p>
  {#if message}<p class="error">{message}</p>{/if}
</form>

<style>
  .form {
    max-width: 400px;
    margin: 10vh auto;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 20px #fcb6d4;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: float 4s ease-in-out infinite;
  }

  input,
  button {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 0.75rem;
    border: 2px solid #ffd6e3;
    outline: none;
  }

  button {
    background: #ff80ab;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;
  }

  button:hover {
    background: #ff4081;
  }

  .link {
    font-size: 0.9rem;
    text-align: center;
    color: #444;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .link:hover {
    color: #ff4081;
    text-decoration: underline;
  }

  .error {
    color: red;
    font-size: 0.9rem;
    text-align: center;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>
