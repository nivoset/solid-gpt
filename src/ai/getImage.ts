import type { CreateImageRequestSizeEnum } from "openai";
import { openai } from "./openai.js";

const getSize = (size: string): CreateImageRequestSizeEnum => {
  switch (`${size}`.toLowerCase()) {
    case "small":
      return "256x256";
    case "medium":
      return "512x512";
    case "large":
      return "1024x1024";
    default:
      return "256x256";
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
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: getSize(size),
      user: "test-account",
      response_format: "b64_json",
    });

    const images = response.data.data.map((d) => `data:image/png;base64,${d.b64_json}`);

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
