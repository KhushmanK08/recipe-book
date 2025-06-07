<script>
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { fly, fade } from "svelte/transition";

  let email = "";
  let password = "";
  let full_name = "";
  let username = "";
  let message = "";

  // Password must be at least 8 chars, include 1 letter and 1 number
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

    // Check for unique username
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();

    if (existingUser) {
      message = "Username already taken. Please choose another.";
      return;
    }

    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { emailRedirectTo: null }, // disables confirmation
    );

    if (error) {
      message = error.message;
      return;
    }

    const { user } = data;

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
