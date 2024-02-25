import { type APIEvent, json } from "solid-start/api";
import { moderate } from "~/ai/moderate";

export async function POST({ request }: APIEvent) {
  const body = await new Response(request.body).text();
  if (!body) return json([]);
  return json(
      await moderate(`${body}`)
  );
}
