import type { Person } from '$lib/types';
import type { Speech } from '$lib/types/speech';
import keycloak from './keycloak';

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
    throw new Error('L\'URL de l\'api n\'est pas définie dans les variables d\'environnement.');
}

type CacheEntry = {
    data: any; // La réponse mise en cache
    expiry: number; // Timestamp d'expiration
};

const cache: Record<string, CacheEntry> = {};

/**
 * Fonction fetch_cached qui met en cache les réponses d'une API pendant 10 secondes.
 * @param url - L'URL de l'API à appeler
 * @param options - Les options pour fetch (facultatif)
 * @returns La réponse de l'API ou la réponse mise en cache
 */
async function fetch_cached(url: string, options?: RequestInit): Promise<any> {
    const cacheKey = JSON.stringify({ url, options }); // Génère une clé unique pour chaque requête
    const now = Date.now();

    // Vérifie si une réponse est dans le cache et qu'elle n'a pas expiré
    if (cache[cacheKey] && cache[cacheKey].expiry > now) {
        return cache[cacheKey].data;
    }

    // Si aucune donnée n'est disponible ou si le cache a expiré, fait un appel API
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Erreur lors de la requête : ${response.statusText}`);
    }

    const data = await response.json(); // Supposons que l'API retourne du JSON

    // Met à jour le cache avec la nouvelle réponse
    cache[cacheKey] = {
        data,
        expiry: now + 10 * 1000, // 10 secondes en millisecondes
    };

    return data;
}

export async function getPeople(quantity: Number = 10, page: Number = 0): Promise<{ people: Person[], nbPerson: number }> {
    let urlParams: { quantity: string, page: string } = {
        quantity: quantity.toString(),
        page: page.toString(),
    }
    const response = await fetch_cached(`${API_BASE}/api/person?` + new URLSearchParams(urlParams));
    return response
}

export async function getPersonById(id: string): Promise<Person> {
    const response = await fetch_cached(`${API_BASE}/api/person/${id}`);
    return response
}

export async function getSpeech(quantity: number, page: number, ids: Array<string>): Promise<Speech[]> {
    let ids_stringified = ids.join(",")
    let urlParams: { quantity: string, page: string, speakers?: string } = {
        quantity: quantity.toString(),
        page: page.toString(),
    }
    if (ids_stringified != "") {
        urlParams.speakers = `[${ids_stringified}]`
    }
    const response = await fetch_cached(`${API_BASE}/api/speech?` + new URLSearchParams(urlParams))
    return response
}

export async function postSpeech(speech: Speech) {
    let speech_to_send = {
        date: new Date(speech.date).toISOString(),
        media: speech.media,
        name: speech.name,
        sentences: speech.sentences,
        speakers: speech.speakers.map((v) => v.uid),
    }
    try {
        const response = await fetch(`${API_BASE}/api/speech`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${keycloak.token || ""}`
            },
            body: JSON.stringify(speech_to_send),
        });
        if (!response.ok) {
            throw new Error("Erreur lors de l'enregistrement du discours");
        }
    } catch (error: any) {
        console.error(`Erreur: ${error.message}`);
    }
}

export async function postPerson(person: Person) {
    let person_to_send = {
        name: person.name,
        firstName: person.firstName,
        birthDate: person.birthDate
    }
    try {
        const response = await fetch(`${API_BASE}/api/person`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${keycloak.token || ""}`,
            },
            body: JSON.stringify(person_to_send)
        });
        if (!response.ok) {
            throw new Error("Erreur lors de l'enregistrement de la person");
        }
    } catch (error: any) {
        console.error(`Erreur: ${error.message}`);
    }
}

export async function getSpeechById(id: string): Promise<Speech> {
    const response_raw = await fetch_cached(`${API_BASE}/api/speech/${id}`);
    let speakers_list = []
    for (let speaker of response_raw.speakers) {
        let speaker_raw = await getPersonById(speaker);
        speakers_list.push({
            uid: speaker_raw.uid,
            name: `${speaker_raw.firstName} ${speaker_raw.name}`,
        })
    }
    const speech_to_respond: Speech = {
        name: response_raw.name,
        date: response_raw.date,
        uid: response_raw.uid,
        speakers: speakers_list,
        media: response_raw.media,
        sentences: response_raw.sentences
    }
    return speech_to_respond
}