import { type APIEvent, json } from "solid-start";
import { readdir, readFile } from 'fs'
import { resolve } from 'path'

const templates = './src/prompts'

const getFiles = async (): Promise<[string, string][]> => {
  return new Promise((res, reject) => {
    readdir(templates, (err, files) => {
      if (err) {
        reject(err);
      } else {
        res(files.map((file) => [file, resolve(templates, file)]));
      }
    });
  })
};

const getTemplateEntry = async (file: string) => {
  return new Promise<string>((res) => {
    readFile(file, 'utf-8', (err, data) => {
      if (err) {
        res('failed to read template');
      } else {
        res(data)
      }
    })})
};

export async function GET({}: APIEvent) {

    const files = await getFiles();
    const mapped = await Promise.allSettled(files.map(([name, file]) => {
      return new Promise<[string, string]>((res) => {
        getTemplateEntry(file).then((data) => [name, data]);
      })
    }))
    
    return json(Object.fromEntries(mapped
      .map((r) => r.status === 'fulfilled' ? r.value : undefined)
      .filter(Boolean)
    ));
}
