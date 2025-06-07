<script context="module">
  import { redirect } from "@sveltejs/kit";

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ parent }) {
    const { user } = await parent();

    if (!user) {
      throw redirect(302, "/login");
    }
  }
</script>

<script>
  import { user } from "$lib/stores";
  import NavBar from "../../components/Navbar.svelte";
</script>

<NavBar />

<slot />
