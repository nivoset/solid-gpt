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
      size: getSize(size), //"256x256",
      user: "test-account",
      response_format: "url", // base64?
      
    });
    const image_url = response.data.data?.find(Boolean)?.url;
    console.log(image_url);

    const results = await fetch(`${image_url}`).then((res) =>
      res.arrayBuffer()
    );

    return `data:image/png;base64,${Buffer.from(results).toString("base64")}`;

    // return image_url
  } catch (e: unknown) {
    console.log("Error", e);
    return JSON.stringify(e);
  }
};
