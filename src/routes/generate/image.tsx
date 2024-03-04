import { For, Match, Switch, createSignal, Suspense } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage'
import { createQuery, createInfiniteQuery } from '@tanstack/solid-query';
import { fetch } from '~/fetch';
import { z } from 'zod';

const apiResponse = z.object({
  images: z.string().array(),
})

const getImage = async (prompt: null | { prompt: string, size: string}): Promise<z.infer<typeof apiResponse>> => {
  if (!prompt) return { images: [] };
  return await fetch.url('/api/ai/image').put(prompt).jsonSchema(apiResponse);
}

export default function GenerateImage() {
  const [inputValue, setInputValue] = makePersisted(createSignal('A picture of a street with trees in fall colors and leaves on the ground.'), { name: 'image prompt' });
  const [sizeValue, setSizeValue] = makePersisted(createSignal('small'), { name: 'image size'});
  const [queryObject, setQueryObject] = createSignal<{ prompt: string, size: string } | null>(null)



  const imageCall = createInfiniteQuery(() => ({
    queryKey: ['image', queryObject()],
    enabled: queryObject() !== null,
    queryFn: async () => getImage(queryObject()),
    getPreviousPageParam: () => true,
    getNextPageParam: () => true,
    initialPageParam: true,
    // select: (data) => data.images
  }))

  const updateData = async () => {
    const prompt = inputValue();
    const size = sizeValue();
    if (prompt )
    setQueryObject((prev) => {
      if (prev?.prompt === prompt && prev?.size === size) {
        imageCall.fetchPreviousPage();
        return prev;
      };
      return    {
        prompt: inputValue(),
        size: sizeValue(),
      }
    })
  }

  return (
    <main class="flex flex-col gap-3 justify-center items-center">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        generate image
      </h1>
      <Switch>
        <Match when={imageCall.isError}>
          <div class="text-red-500">Failed to load</div>
        </Match>
      </Switch>
      <article>
        <select
          value={sizeValue()}
          disabled={imageCall.isFetching}
          onChange={(e) => setSizeValue(e.target.value)}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <textarea
          disabled={imageCall.isFetching}
          class="outline rounded outline-gray-400 active:outline-blue-400 w-[800px] h-[200px] text-black"
          name="prompt"
          value={inputValue()}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </article>
      <button
        disabled={imageCall.isFetching}
        class="bg-blue-400 shadow shadow-black rounded px-3 py-2 disabled:bg-grey-100"
        onClick={updateData}
      >
        {imageCall.isFetching ? 'Processing...' : 'Submit'}
      </button>

      <Suspense fallback={<div>Loading...</div>}>
        <div class="flex flex-wrap gap-3 py-5">
          <For each={imageCall.data?.pages}>
            {(item) => (
              <For each={item.images}>
                {(item) => (
                  <img src={item} />
                )}
              </For>
          )}
          </For>
        </div>
      </Suspense>
    </main>
  );
}

