import { For, Match, Switch, createSignal } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage'

export default function GenerateImage() {
  const [inputValue, setInputValue] = makePersisted(createSignal('A picture of a street with trees in fall colors and leaves on the ground.'), { name: 'image prompt' });
  const [sizeValue, setSizeValue] = makePersisted(createSignal('small'), { name: 'image size'});
  const [errorValue, setErrorValue] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [image, setImage] = createSignal<string[]>()

  const updateData = async () => {
    setLoading(true)
    console.log('started')
    const res = await fetch('/api/ai/image', {
      method: 'put', body: JSON.stringify({
        prompt: inputValue(),
        size: sizeValue(),
      })
    }).then(r => r.json());
    setLoading(false);
    if (res.error) {
      setErrorValue(res.error);
      return;
    }
    console.log('fin')
    setErrorValue(null);
    setImage(res.images);
  }

  return (
    <main class="flex flex-col gap-3 justify-center items-center">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        generate image
      </h1>
      <Switch>
        <Match when={errorValue()}>
          <div class="text-red-500">{errorValue()}</div>
        </Match>
      </Switch>
      <article>
        <select
          value={sizeValue()}
          disabled={loading()}
          onChange={(e) => setSizeValue(e.target.value)}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <textarea
          disabled={loading()}
          class="outline rounded outline-gray-400 active:outline-blue-400 w-[800px] h-[200px] text-black"
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
        {loading() ? 'Processing...' : 'Submit'}
      </button>

      <div class="flex flex-wrap gap-3 py-5">
        <For each={image()}>{(item) => (<img src={item} />)}</For>
      </div>
    </main>
  );
}

