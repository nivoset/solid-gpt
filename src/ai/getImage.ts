import { openai } from './openai.js'


export const getImage = async (prompt: string) => {
  try {
    const response = await openai.createImage({
        prompt,
        n: 1,
        size: "256x256",
        user: "test-account",
        response_format: 'url', // base64?
    });
    const image_url = response.data.data?.find(Boolean)?.url;
    // console.log(image_url.length)

    return fetch(`${image_url}`).then(data => {
      console.table([...data.headers.entries()]);
      return data.text()
    })
    // return image_url;
  } catch (e: unknown) {
    // console.log(openai);
    return JSON.stringify(e);
  }
};

