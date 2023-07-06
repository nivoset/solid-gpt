import { getImage } from '~/ai/getImage';

export async function GET() {
  return new Response(await getImage('routable icon'))
}
