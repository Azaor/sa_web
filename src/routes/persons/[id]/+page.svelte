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
    let education = [
        {
            school: "Université Paris-Saclay",
            degree: "Master en Informatique",
            year: "2020 - 2022",
        },
        {
            school: "Université de Lyon",
            degree: "Licence en Informatique",
            year: "2017 - 2020",
        },
        {
            school: "Lycée Jean Moulin",
            degree: "Baccalauréat Scientifique",
            year: "2015 - 2017",
        },
    ];
    let speechs: Speech[];
    let wordCloud = [
        { word: "innovation", frequency: 70 },
        { word: "équipe", frequency: 60 },
        { word: "succès", frequency: 50 },
        { word: "défi", frequency: 40 },
        { word: "résultat", frequency: 35 },
        { word: "projet", frequency: 30 },
        { word: "stratégie", frequency: 25 },
        { word: "collaboration", frequency: 20 },
        { word: "performance", frequency: 15 },
        { word: "vision", frequency: 10 },
        { word: "leadership", frequency: 5 },
        { word: "challenge", frequency: 5 },
        { word: "croissance", frequency: 4 },
        { word: "partenariat", frequency: 4 },
        { word: "objectif", frequency: 3 },
        { word: "communication", frequency: 3 },
        { word: "leadership", frequency: 5 },
        { word: "challenge", frequency: 5 },
        { word: "croissance", frequency: 4 },
        { word: "partenariat", frequency: 4 },
        { word: "objectif", frequency: 3 },
        { word: "communication", frequency: 3 },
        { word: "leadership", frequency: 5 },
        { word: "challenge", frequency: 5 },
        { word: "croissance", frequency: 4 },
        { word: "partenariat", frequency: 4 },
        { word: "objectif", frequency: 3 },
        { word: "communication", frequency: 3 },
        { word: "leadership", frequency: 5 },
        { word: "challenge", frequency: 5 },
        { word: "croissance", frequency: 4 },
        { word: "partenariat", frequency: 4 },
        { word: "objectif", frequency: 3 },
        { word: "communication", frequency: 3 },
        // Ajoutez jusqu’à 50 mots
        // Ajoutez jusqu’à 50 mots
    ];

    async function loadData(id: string) {
        person = await getPersonById(id);
        isLoadingPerson = false;
        speechs = await getSpeech(10, 0, [id]);
        isLoadingSpeechs = false;
    }
    function getColorBasedOnFrequency(frequency: number) {
        if (frequency > 50) return "#1D4ED8"; // Bleu foncé
        if (frequency > 30) return "#3B82F6"; // Bleu moyen
        if (frequency > 20) return "#60A5FA"; // Bleu clair
        if (frequency > 10) return "#93C5FD"; // Bleu pâle
        return "#CBD5E1"; // Gris clair
    }

    function getBackgroundColorBasedOnFrequency(frequency: number) {
        if (frequency > 50) return "#E0F2FE"; // Bleu pâle
        if (frequency > 30) return "#EFF6FF"; // Gris clair
        if (frequency > 20) return "#F8FAFC"; // Fond blanc cassé
        if (frequency > 10) return "#F3F4F6"; // Gris très clair
        return "#FAFAFA"; // Blanc très clair
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
            <h2>Vocabulaire</h2>
            <div class="relative p-6 min-h-screen">
                <!-- Nuage de mots -->
                <div
                    class="flex flex-wrap justify-center items-center gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                    {#each wordCloud as { word, frequency }}
                        <span
                            class="inline-block font-medium text-gray-800 transform hover:scale-105 transition-transform"
                            style="
          font-size: calc(0.8rem + {frequency / 5}rem);
          color: {getColorBasedOnFrequency(frequency)};
          padding: 0.3rem 0.8rem;
          background-color: {getBackgroundColorBasedOnFrequency(frequency)};
          border-radius: 0.5rem;
        "
                            title="Utilisé {frequency} fois"
                        >
                            {word}
                        </span>
                    {/each}
                </div>
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

                <!-- Informations personnelles -->
                <div class="space-y-4">
                    <!-- Parcours scolaire -->
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">
                            Parcours scolaire
                        </h3>
                        <ul class="space-y-4 mt-2">
                            {#each education as edu}
                                <li>
                                    <h4
                                        class="text-sm font-semibold text-blue-500"
                                    >
                                        {edu.school}
                                    </h4>
                                    <p class="text-sm text-gray-600">
                                        {edu.degree}
                                    </p>
                                    <p class="text-sm text-gray-400">
                                        {edu.year}
                                    </p>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
