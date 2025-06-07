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
  :global(body) {
    background-color: #f3e9dc;
    color: #2e2e2e;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .form {
    max-width: 400px;
    margin: 10vh auto;
    background: #c3b091; /* light mocha */
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 15px rgba(142, 128, 106, 0.5);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: float 4s ease-in-out infinite;
    color: #2e2e2e;
  }

  input,
  button {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 0.75rem;
    border: 2px solid #8e806a; /* espresso brown */
    outline: none;
    background: #f3e9dc; /* latte beige */
    color: #2e2e2e;
    transition: border-color 0.3s ease;
  }

  input:focus {
    border-color: #c3b091; /* light mocha */
  }

  button {
    background: #8e806a; /* espresso brown */
    color: #f3e9dc; /* latte beige */
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
    border: none;
  }

  button:hover {
    background: #c3b091; /* light mocha */
    color: #2e2e2e;
  }

  .link {
    font-size: 0.9rem;
    text-align: center;
    color: #2e2e2e;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .link:hover {
    color: #8e806a; /* espresso brown */
    text-decoration: underline;
  }

  .error {
    color: #b34040;
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
