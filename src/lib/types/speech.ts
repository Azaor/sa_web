export interface Speech {
    uid: string,
    name: string,
    date: string,
    speakers: Array<{ uid: string, name: string }>,
    media: string,
    sentences: Array<Sentence>
}

export interface Sentence {
    uid: string,
    speaker: string,
    text: string,
    interrupted: Boolean,
}