import { createResource, createSignal } from 'solid-js';


type ResultItem = {
    title: string;
    author_name: string[];
};
export async function searchBooks(query: string) {
    if (query.trim() === "") return [];
    const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURI(query)}`
    );
    const results = await response.json();
    const documents = results.docs as ResultItem[];
    console.log(documents);
    return documents.slice(0, 10).map(({ title, author_name }) => ({
        title,
        author: author_name?.join(", "),
    }));
}

export default function GenerateImage() {
    const [ inputValue, setInputValue ] = createSignal('')
    const [ loading, setLoading] = createSignal(false)
    const [ image, setImage] = createSignal<string>()

    const updateData = async () => {
      setLoading(true)
      const res = await fetch('/api/ai/image').then(r => r.json());
      console.log(res.length);
      setImage(res);
      setLoading(false);
    }

    return (
        <main class="flex flex-col gap-3 justify-center items-center">
            <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
                generate image
            </h1>
            <article>
                <textarea
                    disabled={loading()}
                    class="outline rounded outline-gray-400 active:outline-blue-400 w-[800px] h-[200px]"
                    name="prompt"
                    value={inputValue()}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </article>
            <button
                disabled={loading()}
                class="bg-blue-400 shadow shadow-black rounded px-3 py-2 disabled:bg-grey-100"
                onClick={updateData}
            >
                Submit ({`${loading()}`})
            </button>
            <pre>{JSON.stringify(image(), null, '\t')}</pre>

            <img class="pt-5" src={image()} />
        </main>
    );
}

