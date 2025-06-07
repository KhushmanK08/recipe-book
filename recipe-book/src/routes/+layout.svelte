<script>
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabaseClient";
	import { user } from "$lib/stores";
	import "../app.css";

	onMount(async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		user.set(session?.user ?? null);

		// Listen for auth changes (login/logout)
		supabase.auth.onAuthStateChange((_event, session) => {
			user.set(session?.user ?? null);
		});
	});
</script>

<slot />
