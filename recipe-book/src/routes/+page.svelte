<script>
  import { fade, fly } from "svelte/transition";
  import { goto } from "$app/navigation";

  function goToSignup() {
    goto("/signup");
  }

  const petals = Array.from({ length: 30 }, () => ({
    left: Math.random() * 100,
    size: 20 + Math.random() * 20,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
    rotate: Math.random() * 360,
    blur: 1 + Math.random() * 1.5,
    glow: 2 + Math.random() * 3,
  }));
</script>

<div class="petal-container">
  {#each petals as petal}
    <svg
      class="petal"
      style="
        left: {petal.left}vw;
        width: {petal.size}px;
        height: {petal.size * 1.5}px;
        animation-delay: {petal.delay}s;
        animation-duration: {petal.duration}s;
        transform: rotate({petal.rotate}deg);
        filter: blur({petal.blur}px) drop-shadow(0 0 {petal.glow}px var(--accent));
      "
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M32 0C22 18 2 26 16 44C24 56 32 64 32 64C32 64 40 56 48 44C62 26 42 18 32 0Z"
        fill="var(--accent)"
        fill-opacity="0.7"
      />
    </svg>
  {/each}
</div>

<main>
  <h1 in:fly={{ y: -50, duration: 700 }} out:fade>
    Welcome to Your Recipe Book
  </h1>
  <p in:fade={{ delay: 500, duration: 1000 }}>
    Store your favorite recipes and find new dishes based on the ingredients you
    have at home.
  </p>
  <button
    class="btn"
    on:click={goToSignup}
    in:fly={{ y: 50, duration: 700, delay: 1500 }}
  >
    Get Started
  </button>
</main>

<style>
  main {
    position: relative;
    z-index: 10;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 1rem;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: var(--accent);
    font-weight: 900;
    margin: 0;
    letter-spacing: 0.1em;
  }

  p {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    margin-top: 1rem;
    color: var(--primary);
    max-width: 90vw;
    max-width: clamp(300px, 90vw, 600px);
  }

  .btn {
    margin-top: 3rem;
    background-color: var(--primary);
    color: var(--text);
    font-weight: bold;
    padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 3rem);
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    border-radius: 50px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 15px var(--primary);
    transition:
      box-shadow 0.3s ease,
      background-color 0.3s ease;
  }

  .btn:hover {
    background-color: var(--accent);
    box-shadow: 0 0 25px var(--accent);
  }

  .petal-container {
    position: fixed;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
  }

  .petal {
    position: absolute;
    top: -100px;
    animation-name: fall;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    opacity: 0.8;
  }

  @keyframes fall {
    0% {
      transform: translateX(0px) translateY(0) rotate(0deg);
      opacity: 0.8;
    }
    20% {
      transform: translateX(-20px) translateY(20vh) rotate(72deg);
    }
    40% {
      transform: translateX(20px) translateY(40vh) rotate(144deg);
    }
    60% {
      transform: translateX(-15px) translateY(60vh) rotate(216deg);
    }
    80% {
      transform: translateX(15px) translateY(80vh) rotate(288deg);
    }
    100% {
      transform: translateX(0px) translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
</style>
