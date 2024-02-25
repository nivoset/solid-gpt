import { type APIEvent, json } from "solid-start/api";
import { getImage } from "~/ai/getImage";

export async function PUT({ request }: APIEvent) {
  return json(await getImage(await request.json() as any));
}
