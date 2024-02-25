import { OpenAI } from "openai";

export const openai = new OpenAI({
    organization: process.env.SOLID_APP_OPENAI_ORGANIZATION,
    apiKey: process.env.SOLID_APP_OPENAI_API_KEY,
});
