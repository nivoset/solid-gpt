import { type APIEvent, json } from "solid-start";
import { getChat } from "~/ai/getChat";

export async function POST({ request }: APIEvent) {
    const body = await new Response(request.body).text();
    if (!body) return json([]);
    return json(
        await getChat(
            `You: ${body}`
        )
    );
}
