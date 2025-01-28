<script lang="ts">
    import { goto } from "$app/navigation";
    import SpeechCard from "$lib/components/SpeechCard.svelte";
    import type { Person, Speech } from "$lib/types";
    import { getPersonById, getSpeech } from "$lib/utils/api";
    import { getContext, onMount } from "svelte";

    let isAuthenticated: any = getContext("isAuthenticated");
    let getUserInfo: any = getContext("getUserInfo");

    let speeches: Speech[] = $state([]);
    let speakersName: Person[][] = $state([]);
    let currentPage = $state(0);
    let totalPages = $state(0);

    onMount(async () => {
        speeches = await getSpeech(10, 0, []);
        let idx = 0;
        for (let speech of speeches) {
            speakersName.push([]);
            for (let speakerId of speech.speakers) {
                speakersName[idx].push(await getPersonById(speakerId));
            }
            idx += 1;
        }
    });
</script>

<div class="relative p-6 min-h-screen bg-gray-50">
    <h1
        class="text-3xl font-bold text-gray-800 mb-8 border-b border-blue-300 pb-4"
    >
        Liste des Discours
    </h1>

    <!-- Message de chargement -->
    {#if speeches.length === 0}
        <div class="text-center text-gray-500 italic">
            Chargement des données...
        </div>
    {/if}

    <!-- Options de recherche et d'ordonnancement -->
    <div
        class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6"
    >
        <!-- Recherche -->
        <div class="flex items-center w-full md:w-1/3">
            <input
                type="text"
                placeholder="Rechercher un discours..."
                class="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                oninput={() => {}}
            />
        </div>

        <!-- Ordonnancement -->
        <div class="flex items-center space-x-2">
            <label for="sort" class="text-sm font-medium text-gray-600"
                >Trier par :</label
            >
            <select
                id="sort"
                class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                onchange={() => {}}
            >
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="date-asc">Date (ancienne à récente)</option>
                <option value="date-desc">Date (récente à ancienne)</option>
            </select>
        </div>
    </div>
    <!-- Tableau des discours -->
    {#if speeches.length > 0}
        <div
            class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm"
        >
            <table class="min-w-full divide-y divide-gray-200 text-gray-700">
                <thead class="bg-blue-50">
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Titre
                        </th>
                        <th
                            class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Date
                        </th>
                        <th
                            class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Participants
                        </th>
                        <th
                            class="px-6 py-3 text-center text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    {#each speeches as speech, key}
                        <tr class="hover:bg-blue-50">
                            <!-- Titre -->
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                                {speech.name}
                            </td>
                            <!-- Date -->
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                                {new Date(speech.date).toLocaleDateString()}
                            </td>
                            <!-- Participants -->
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <div class="flex flex-wrap gap-2">
                                    {#each speakersName[key] as speaker}
                                        <a
                                            href={`/persons/${speaker.uid}`}
                                            class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-lg hover:bg-blue-200"
                                        >
                                            {speaker.firstName}
                                            {speaker.name}
                                        </a>
                                    {/each}
                                </div>
                            </td>
                            <!-- Actions -->
                            <td
                                class="px-6 py-4 whitespace-nowrap text-center text-sm"
                            >
                                <a
                                    href={`/speeches/${speech.uid}`}
                                    class="text-blue-600 hover:text-blue-800 font-semibold transition"
                                >
                                    Voir plus
                                </a>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
        <button
            type="button"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onclick={() => {}}
            disabled={currentPage <= 1}
        >
            Précédent
        </button>
        <p class="text-sm text-gray-700">
            Page {currentPage} sur {totalPages}
        </p>
        <button
            type="button"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onclick={() => {}}
            disabled={currentPage === totalPages}
        >
            Suivant
        </button>
    </div>

    <!-- Bouton Ajouter un discours -->
    {#if isAuthenticated() && getUserInfo().permissions.includes("CreateSpeech")}
        <button
            type="button"
            class="fixed bottom-6 right-6 bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 w-40 h-12 rounded-lg flex items-center justify-center transition-transform transform hover:scale-110"
            onclick={() => goto("/speeches/new")}
        >
            Ajouter un discours
        </button>
    {/if}
</div>
