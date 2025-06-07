<script>
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";

  let email = "";
  let password = "";
  let full_name = "";
  let username = "";
  let message = "";

  const passwordIsValid = (pw) => {
    return pw.length >= 8 && /[a-zA-Z]/.test(pw) && /\d/.test(pw);
  };

  const handleSignup = async () => {
    message = "";

    if (!passwordIsValid(password)) {
      message =
        "Password must be at least 8 characters and include a letter and a number.";
      return;
    }

    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      message = "Username already taken. Please choose another.";
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: null,
      },
    });

    if (error) {
      message = error.message;
      return;
    }

    const { user } = data;
    console.log("Signed up user:", user);

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: user.id,
        full_name,
        username,
        email,
      },
    ]);

    if (insertError) {
      message = insertError.message;
    } else {
      goto("/dashboard");
    }
  };

  const goToLogin = () => goto("/login");
</script>

<form on:submit|preventDefault={handleSignup} in:fly={{ y: 30 }} class="form">
  <h2 in:fade>Sign Up</h2>
  <input type="text" placeholder="Full Name" bind:value={full_name} required />
  <input type="text" placeholder="Username" bind:value={username} required />
  <input type="email" placeholder="Email" bind:value={email} required />
  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
  />
  <button type="submit">Sign Up</button>
  <p class="link" on:click={goToLogin}>Already have an account? Log in</p>
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
    box-shadow: 0 4px 15px rgba(142, 128, 106, 0.5); /* espresso brown glow */
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
