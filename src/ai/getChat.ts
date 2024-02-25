import { openai } from "./openai.js";

export const getChat = async (
    prompt = `
    You: How do I combine arrays?
    JavaScript chatbot: You can use the concat() method.
    You: How do you make an alert appear after 10 seconds?
    JavaScript chatbot"`
) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            temperature: 0,
            max_tokens: 500,
            top_p: 1.0,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
            stop: ["You:"],
        });
        const choices = response.data.choices;

        return choices;
    } catch (e: unknown) {
        return JSON.stringify(e);
    }
};
