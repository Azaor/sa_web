<script lang="ts">
    import { goto } from "$app/navigation";
    import PersonCard from "$lib/components/PersonCard.svelte";
    import type { Person } from "$lib/types";
    import { getPeople } from "$lib/utils/api";
    import { getContext, onMount } from "svelte";

    let isAuthenticated: () => boolean = getContext("isAuthenticated");
    let getUserInfo: () => any = getContext("getUserInfo");

    let people: Person[] = $state([]);
    let currentPage = $state(0);
    let totalPages = $state(0);

    onMount(async () => {
        people = await getPeople();
    });
</script>

<div class="relative p-6 min-h-screen">
    <h1 class="text-3xl font-semibold text-gray-900 mb-8">
        Liste des personnalités
    </h1>

    {#if people.length === 0}
        <div class="text-center text-gray-600 animate-pulse">
            Chargement des données...
        </div>
    {/if}
    {#if isAuthenticated() && getUserInfo().permissions.includes("CreateSpeech")}
        <div class="flex justify-end p-4">
            <button
                type="button"
                class="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-transform transform hover:scale-105"
                onclick={() => goto("/persons/new")}
            >
                + Ajouter une personnalité
            </button>
        </div>
    {/if}
    {#if people.length > 0}
        <div
            class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm"
        >
            <table class="min-w-full divide-y divide-gray-200 text-gray-700">
                <thead class="bg-blue-50">
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Nom complet
                        </th>
                        <th
                            class="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Date de naissance
                        </th>
                        <th
                            class="px-6 py-3 text-center text-sm font-bold text-gray-700 uppercase tracking-wider"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    {#each people as person, key}
                        <tr class="hover:bg-blue-50">
                            <!-- Titre -->
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                                {`${person.name} ${person.firstName}`}
                            </td>
                            <!-- Date -->
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                                {new Date(
                                    person.birthDate,
                                ).toLocaleDateString()}
                            </td>
                            <!-- Actions -->
                            <td
                                class="px-6 py-4 whitespace-nowrap text-center text-sm"
                            >
                                <a
                                    href={`/persons/${person.uid}`}
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
</div>
