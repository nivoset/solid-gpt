import { openai } from "./openai.js";
import { appendFile } from 'fs'
import path from 'path'

export const satSomething = async (
    prompt = `
    You: How do I combine arrays?
    JavaScript chatbot: You can use the concat() method.
    You: How do you make an alert appear after 10 seconds?
    JavaScript chatbot"`,
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy"
) => {
    try {
        console.log('prompt', prompt);
        // console.log('__dirname', __dirname);
        const pa = path.join('.', `${prompt.replaceAll(' ', '_')}.mp3`);
        const response = await openai.audio.speech.create({
            model: "tts-1",
            input: prompt,
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
