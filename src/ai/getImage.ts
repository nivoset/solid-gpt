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
      n: 3,
      size: getSize(size), //"256x256",
      user: "test-account",
      response_format: "url", // base64?
      
    });

    const urls = response.data.data.map((d) => d.url);
    const images = await Promise.all(urls.map((url) => fetch(`${url}`).then((res) => res.arrayBuffer())));
    const base64Images = images.map((image) => `data:image/png;base64,${Buffer.from(image).toString("base64")}`);

    return JSON.stringify({ prompt, images: base64Images });

  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("Error", e.message, ((e as any).response.status));
      return JSON.stringify({ prompt, error: e.message, images: [] });
    }
    console.log("Error", e && (typeof e === "object" && 'message' in e ? e.message : Object.keys(e)) );
    return JSON.stringify({ prompt, error: 'Error generating image(s)', images: []});
  }
};
