<script>
  import { supabase } from "$lib/supabaseClient";
  let email = "";
  let password = "";
  let full_name = "";
  let username = "";
  let message = "";

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return (message = error.message);

    const { user } = data;
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: user.id,
        full_name,
        username,
      },
    ]);

    if (profileError) {
      message = profileError.message;
    } else {
      message = "Signup successful! Check your email to confirm.";
    }
  };
</script>

<form on:submit|preventDefault={handleSignup}>
  <h2>Sign Up</h2>
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
  {#if message}<p>{message}</p>{/if}
</form>
