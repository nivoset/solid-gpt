import { openai } from "./openai.js";

const getSize = (size: string) => {
  switch (`${size}`.toLowerCase()) {
    case "small":
      return "256x256" as const;
    case "medium":
      return "512x512" as const;
    case "large":
      return "1024x1024" as const;
    default:
      return "256x256" as const;
  }
};

export const getImage = async ({
  prompt,
  size,
}: {
  prompt: string;
  size: string;
}) => {
  try {
    const response = await openai.images.generate({
      // model: 'dall-e-3',
      prompt,
      n: 2,
      size: getSize(size),
      // user: "test-account",
      response_format: "b64_json",
    });
    console.log(response);
    const images = response.data.map((d) => `data:image/png;base64,${d.b64_json}`);

    return ({ prompt, images });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("Error", e.message, ((e as any).response.status));
      return ({ prompt, error: e.message, images: [] });
    }
    console.log("Error", e && (typeof e === "object" && 'message' in e ? e.message : Object.keys(e)) );
    return ({ prompt, error: 'Error generating image(s)', images: []});
  }
};
