import { type APIEvent, json } from "solid-start/api";
import { getImage } from "~/ai/getImage";

export async function PUT({ request }: APIEvent) {
  return new Response(await getImage(await request.json()));
}
