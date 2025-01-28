<script lang="ts">
    import type { Person } from "$lib/types";
    import { getPersonById, getSpeech } from "$lib/utils/api";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import type { Speech } from "$lib/types/speech";
    import SpeechCard from "$lib/components/SpeechCard.svelte";

    let isLoadingPerson: Boolean = true;
    let isLoadingSpeechs: Boolean = true;
    let person: Person;
    let speechs: Speech[];

    async function loadData(id: string) {
        person = await getPersonById(id);
        isLoadingPerson = false;
        speechs = await getSpeech(10, 0, [id]);
        isLoadingSpeechs = false;
    }

    $: {
        const id = $page.params.id; // Reactive access to the current route parameter
        loadData(id);
    }
</script>

<div class="flex min-h-screen bg-gray-50">
    <!-- Colonne gauche -->
    <div class="w-full md:w-3/4 p-6">
        <section>
            <h2 class="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Discours récents
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each speechs as speech}
                    <SpeechCard {speech} />
                {/each}
            </div>
        </section>
    </div>

    <!-- Colonne droite -->
    <div class="md:w-1/4 p-6">
        <div
            class="sticky top-6 w-full bg-white border border-gray-200 shadow-md rounded-lg p-6"
        >
            {#if isLoadingPerson}
                <div class="text-center text-gray-500">
                    Chargement des données...
                </div>
            {:else}
                <!-- Profil de la personne -->
                <div class="flex flex-col items-center mb-6">
                    <!-- Avatar -->
                    <div
                        class="w-24 h-24 flex justify-center items-center bg-blue-100 text-blue-500 rounded-full shadow-md mb-4"
                    >
                        <svg
                            width="40px"
                            height="40px"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            class="bi bi-person"
                        >
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                            />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 text-center">
                        {person.firstName}
                        {person.name}
                    </h2>
                    <p class="text-sm text-gray-500">"Politique"</p>
                </div>
            {/if}
        </div>
    </div>
</div>
