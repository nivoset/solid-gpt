import { type APIEvent, json,  } from "solid-start";
import { satSomething } from "~/ai/say-something";
import { z } from "zod";

const promptSchema = z.object({
  text: z.string(),
  voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]).default('alloy'),
})


export async function POST({ request }: APIEvent) {
    const body = promptSchema.safeParse(await new Response(request.body).json());
    if (!body.success) return json({ error: "Invalid Request" }, 400);
    return json(await satSomething(body.data));
}
