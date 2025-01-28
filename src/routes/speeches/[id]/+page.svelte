<script lang="ts">
    import type { Sentence, Speech } from "$lib/types";
    import { getSpeechById } from "$lib/utils/api";
    import { page } from "$app/state";
    let { isAuthenticated, userInfo } = $props();

    let speech: Speech | null = $state(null);
    let sentences_compressed: Sentence[] = $state([]);

    async function loadData(id: string) {
        speech = await getSpeechById(id);
        let curr_sentence: Sentence | undefined;
        for (let sentence of speech?.sentences) {
            if (curr_sentence?.speaker == sentence.speaker) {
                curr_sentence.text = `${curr_sentence.text}\n${sentence.text}`;
            } else if (curr_sentence) {
                sentences_compressed.push(curr_sentence);
                curr_sentence = sentence;
            } else {
                curr_sentence = sentence;
            }
        }
        if (curr_sentence) {
            sentences_compressed.push(curr_sentence);
        }
    }

    $effect(() => {
        loadData(page.params.id);
    });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
    {#if speech != null}
        <!-- En-tête -->
        <div class="bg-white shadow py-6 px-4 md:px-8 border-b">
            <h1 class="text-3xl font-bold text-gray-800">{speech.name}</h1>
            <div class="mt-4 space-y-2">
                <p class="text-gray-600">
                    <span class="font-medium text-gray-700">Date :</span>
                    {new Date(speech.date).toLocaleDateString()}
                </p>
                <div class="text-gray-600">
                    <span class="font-medium text-gray-700">Participants :</span
                    >
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each speech.speakers as speaker}
                            <a
                                href={`/persons/${speaker.uid}`}
                                class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-lg hover:bg-blue-200 transition"
                            >
                                {speaker.name}
                            </a>
                        {/each}
                    </div>
                </div>
            </div>
        </div>

        <!-- Contenu -->
        <div class="flex-grow px-4 md:px-8 py-6">
            <div class="bg-white shadow-lg rounded-lg p-6">
                <!-- Titre -->
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-semibold">Transcription</h2>
                    <button
                        type="button"
                        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                        onclick={() => {}}
                    >
                        Télécharger la transcription
                    </button>
                </div>
                <p class="text-sm text-gray-500 mt-2">UID : {speech.uid}</p>

                <!-- Liste des phrases -->
                <div class="space-y-6 mt-6">
                    {#each sentences_compressed as { speaker, text }}
                        <div class="flex items-start space-x-4">
                            <!-- Avatar du participant -->
                            <div
                                class="w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold"
                            >
                                {speech.speakers
                                    ?.find((v) => v.uid == speaker)
                                    ?.name.charAt(0) || ""}
                            </div>
                            <!-- Contenu de la phrase -->
                            <div>
                                <p class="text-sm text-gray-500 font-semibold">
                                    {speech.speakers?.find(
                                        (v) => v.uid == speaker,
                                    )?.name || ""}
                                </p>
                                <p
                                    class="text-gray-700 whitespace-pre-line text-sm"
                                >
                                    {text}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-100 py-4 px-4 md:px-8 text-center border-t">
            <p class="text-sm text-gray-600">UID du discours : {speech.uid}</p>
        </div>
    {/if}
</div>
