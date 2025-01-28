<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Person } from "$lib/types";
    import { postPerson } from "$lib/utils/api";

    let person: Person = {
        firstName: "",
        name: "",
        birthDate: "",
        uid: "",
        trustScore: 0,
    };

    const handleSubmit = async () => {
        await postPerson(person);
        goto("/persons");
    };
</script>

<div class="w-full space-y-8 bg-white p-6">
    <h2 class="text-center text-2xl font-bold text-gray-900">
        Ajouter une personne
    </h2>
    <form on:submit={handleSubmit} class="space-y-6">
        <!-- Prénom -->
        <div>
            <label
                for="speech-name"
                class="block text-sm font-medium text-gray-700"
                >Nom de famille</label
            >
            <input
                type="text"
                id="speech-name"
                bind:value={person.name}
                placeholder="Ex: Ducatore"
                class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <!-- Nom -->
        <div>
            <label
                for="speech-name"
                class="block text-sm font-medium text-gray-700">Prénom</label
            >
            <input
                type="text"
                id="speech-name"
                bind:value={person.firstName}
                placeholder="Ex: Leonide"
                class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        <!-- Date de naissance -->
        <div>
            <label
                for="speech-name"
                class="block text-sm font-medium text-gray-700"
                >Date de naissance</label
            >
            <input
                type="date"
                id="speech-name"
                bind:value={person.birthDate}
                placeholder="Ex: 01/01/1999"
                class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <!-- Bouton de soumission -->
        <div>
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Ajouter
            </button>
        </div>
    </form>
</div>
