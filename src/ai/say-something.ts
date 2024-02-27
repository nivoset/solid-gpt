import { openai } from "./openai.js";
import { appendFile } from 'fs'
import path from 'path'

export const satSomething = async ({
  text, voice = "alloy"
}: {
    text: string,
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
}) => {
    try {
        console.log('prompt', text);
        // console.log('__dirname', __dirname);
        const pa = path.join('.', `${text.replaceAll(' ', '_')}.mp3`);
        const response = await openai.audio.speech.create({
            model: "tts-1",
            input: text,
            voice,
        });
        // console.log(response);
        // console.log(response)
        appendFile(pa, Buffer.from(await response.arrayBuffer()), (err: unknown) => err ? console.error(err) : console.log('succ'))

        return response.blob();
    } catch (e: unknown) {
        return JSON.stringify(e);
    }
};
