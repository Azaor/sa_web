<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    // Redirection automatique au montage de la page
    onMount(() => {
        goto("/persons"); // Redirige vers la page de la liste des utilisateurs
    });
</script>

<p>Redirection en cours...</p>
<!-- Message temporaire avant la redirection -->
