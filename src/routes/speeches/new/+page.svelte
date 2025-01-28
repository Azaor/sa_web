<script lang="ts">
  import type { Sentence, Speech } from "$lib/types";
  import { getPeople, postSpeech } from "$lib/utils/api";
  import { onMount } from "svelte";

  // Données du formulaire
  let speech: Speech = $state({
    uid: "new",
    media: "",
    name: "",
    date: "",
    speakers: [],
    sentences: [
      {
        uid: "",
        interrupted: false,
        text: "",
        speaker: "",
      },
    ],
  });
  let dropdownOpen = $state(false);
  const toggleSelection = (speaker: { uid: string; name: string }) => {
    if (speech.speakers.includes(speaker)) {
      speech.speakers = speech.speakers.filter((o: any) => o !== speaker);
    } else {
      speech.speakers = [...speech.speakers, speaker];
    }
  };
  // Fonction pour ajouter une phrase
  const addPhrase = () => {
    speech.sentences.push({
      uid: speech.sentences.length.toString(),
      interrupted: false,
      text: "",
      speaker: "",
    });
  };

  // Fonction pour supprimer une phrase
  const removePhrase = (index: number) => {
    speech.sentences.splice(index, 1);
  };

  // Fonction pour soumettre le formulaire
  const submitForm = async () => {
    let new_sentences: Sentence[] = [];
    for (let sentence of speech.sentences) {
      let text_splitted = sentence.text.split(".");
      for (let part of text_splitted) {
        new_sentences.push({
          uid: speech.sentences.length.toString(),
          interrupted: false,
          text: part,
          speaker: sentence.speaker,
        });
      }
    }
    await postSpeech(speech);
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    speech = {
      uid: "new",
      media: "",
      name: "",
      date: "",
      speakers: [],
      sentences: [],
    };
  };
  let speakers: { uid: string; name: string }[] = $state([]);

  async function loadSpeakers() {
    let peoples = await getPeople();
    for (let person of peoples) {
      speakers.push({
        uid: person.uid,
        name: `${person.firstName} ${person.name}`,
      });
    }
  }
  onMount(async () => {
    await loadSpeakers();
  });
</script>

<div class="w-full bg-white rounded-lg p-8">
  <!-- Titre de la page -->
  <h1 class="text-3xl font-bold text-gray-800 mb-6">Créer un Discours</h1>

  <!-- Formulaire principal -->
  <form class="space-y-8" onsubmit={() => submitForm()}>
    <!-- Nom du discours -->
    <div>
      <label for="speech-name" class="block text-sm font-medium text-gray-700"
        >Nom du discours</label
      >
      <input
        type="text"
        id="speech-name"
        bind:value={speech.name}
        placeholder="Ex: Discours sur l'innovation"
        class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div>
      <label for="speech-media" class="block text-sm font-medium text-gray-700"
        >Media</label
      >
      <input
        type="text"
        id="speech-media"
        bind:value={speech.media}
        placeholder="Ex: TF1"
        class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Date -->
    <div>
      <label for="speech-date" class="block text-sm font-medium text-gray-700"
        >Date</label
      >
      <input
        type="date"
        id="speech-date"
        bind:value={speech.date}
        class="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Participants -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Participants</label
      >
      <div class="space-y-4 mt-4">
        <div class="relative w-full mx-auto">
          <!-- Trigger Button -->
          <button
            class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            type="button"
            onclick={() => (dropdownOpen = !dropdownOpen)}
          >
            {#if speech.speakers.length > 0}
              {speech.speakers.map((o: any) => o.name).join(", ")}
            {:else}
              Select options
            {/if}
            <span class="float-right material-icons">expand_more</span>
          </button>

          <!-- Dropdown -->
          {#if dropdownOpen}
            <ul
              class="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-auto"
            >
              {#each speakers as speaker}
                <li
                  class="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onclick={() => toggleSelection(speaker)}
                >
                  <input
                    type="checkbox"
                    checked={speech.speakers.includes(speaker)}
                    class="mr-2"
                  />
                  {speaker.name}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>

    <!-- Phrases -->
    <!-- Phrases -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Phrases</label>
      <div class="space-y-4 mt-4">
        {#each speech.sentences as phrase, index}
          <div class="border rounded-md p-4">
            <div class="flex items-center justify-between">
              <!-- Sélecteur de participant -->
              <select
                bind:value={speech.sentences[index].speaker}
                class="block w-1/3 px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Sélectionner un participant</option>
                {#each speech.speakers as speaker}
                  <option value={speaker.uid}>{speaker.name}</option>
                {/each}
              </select>
              <button
                type="button"
                onclick={() => removePhrase(index)}
                class="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
            <!-- Champ pour la phrase -->
            <textarea
              rows="2"
              bind:value={speech.sentences[index].text}
              class="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Écrivez la phrase ici..."
            ></textarea>
          </div>
        {/each}
        <button
          type="button"
          onclick={addPhrase}
          class="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 w-full"
        >
          Ajouter une phrase
        </button>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-4">
      <button
        type="button"
        onclick={resetForm}
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
      >
        Réinitialiser
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
      >
        Enregistrer le discours
      </button>
    </div>
  </form>
</div>

<style>
  /* Material Icons */
  @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

  /* Add fade transition for dropdown */
  :global(ul[transition\:fade]) {
    opacity: 0;
    transform: scaleY(0.9);
    transform-origin: top;
    transition: all 0.2s ease-in-out;
  }

  :global(ul[transition\:fade]:enter) {
    opacity: 1;
    transform: scaleY(1);
  }

  :global(ul[transition\:fade]:leave) {
    opacity: 0;
    transform: scaleY(0.9);
  }
</style>
