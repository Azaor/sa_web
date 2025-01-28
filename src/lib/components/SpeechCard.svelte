<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Person } from "$lib/types";
    import { getPersonById } from "$lib/utils/api";
    import { onMount } from "svelte";
    import { preventDefault } from "svelte/legacy";

    let { speech } = $props();

    let speakersName: Person[] = $state([]);
    onMount(async () => {
        for (let speakerId of speech.speakers) {
            speakersName.push(await getPersonById(speakerId));
        }
    });
    function change_page() {
        goto(`/speeches/${speech.uid}`);
    }
    console.log(speakersName);
</script>

<button
    type="button"
    onclick={change_page}
    class="block max-w-sm mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300 hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
>
    <div class="px-6 py-4">
        <!-- Titre -->
        <div class="font-bold text-xl mb-2">{speech.name}</div>

        <!-- Date -->
        <p class="text-gray-600 text-sm">
            {new Date(speech.date).toLocaleDateString()}
        </p>

        <!-- Orateurs -->
        <div class="mt-2">
            <span class="text-gray-700 text-sm font-semibold"
                >Participants:
            </span>
            <div class="text-gray-600 text-sm">
                {#each speakersName as speaker}
                    <a
                        href={`/persons/${speaker.uid}`}
                        class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                        >{speaker.firstName} {speaker.name}</a
                    >
                {/each}
            </div>
        </div>
    </div>

    <div class="px-6 py-4">
        <!-- Bouton d'action -->
        <a
            href={`/speeches/${speech.uid}`}
            class="text-blue-500 hover:text-blue-700 font-semibold">Voir plus</a
        >
    </div>
</button>
