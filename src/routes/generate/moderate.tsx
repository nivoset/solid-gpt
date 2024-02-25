import { For, createSignal } from "solid-js";
import { z } from 'zod'
import createLocalStorageSignal from '~/signal/createLocalStorageSignal';


const apiSchema = z
    .object({
        categories: z.object({
          'sexual': z.boolean(),
          hate: z.boolean(),
          harassment: z.boolean(),
          'self-harm': z.boolean(),
          'sexual/minors': z.boolean(),
          'hate/threatening': z.boolean(),
          'violence/graphic': z.boolean(),
          'self-harm/intent': z.boolean(),
          'self-harm/instructions': z.boolean(),
          'harassment/threatening': z.boolean(),
          violence: z.boolean()
        }),
        category_scores: z.object({
          'sexual': z.number(),
          hate: z.number(),
          harassment: z.number(),
          'self-harm': z.number(),
          'sexual/minors': z.number(),
          'hate/threatening': z.number(),
          'violence/graphic': z.number(),
          'self-harm/intent': z.number(),
          'self-harm/instructions': z.number(),
          'harassment/threatening': z.number(),
          violence: z.number()
        }),
    })
    .array();

type Api = z.infer<typeof apiSchema>[number]

export default function GenerateCode() {
    const [store, setStore] = createLocalStorageSignal<Array<Api & { message: string }>>('conversation', []);
    const [inputRef, setInputRef] = createSignal<HTMLTextAreaElement>()
    const [loading, setLoading] = createSignal(false);

    const updateData = async () => {
        setLoading(true);
        const ref = inputRef();
        if (!ref) return
        const text = ref.value;

        const res = await fetch("/api/ai/moderate", { method: "post", body: text, }).then((r) => r.json())
        console.log(res);
        const parsed = await apiSchema.parse(res);

        console.table(parsed)
        setStore(parsed.map((val) => ({ ...val, message: text })));

        // clean input value
        ref.value = ''
        setLoading(false);
    };

    return (
        <main class="flex flex-col gap-3 justify-center items-center">
            <h1 class="max-6-xs text-6xl text-sky-300 font-thin capitalize my-16">
                Moderate Chat
            </h1>
            <article class="flex flex-col">
                <For each={store()} fallback={<>start your chat...</>}>
                    {(item) => (
                      <>
                        <div class="flex flex-col flex-wrap text-sm">
                          <div class="capitalize">{item.message}</div>
                          <For each={Object.entries(item.categories)}>
                            {([key, value]) => (
                              <div class="capitalize inline-flex gap-3 justify-between"><span>{key}:</span><span>{value ? 'True' : 'False'}</span></div>
                            )}
                          </For>
                        </div>
                      </>
                    )}
                </For>
            </article>
            <div class="grid grid-cols-[90fr_10fr] group outline outline-transparent focus-within:outline-blue-400  shadow shadow-slate-900 rounded">
                <textarea
                    disabled={loading()}
                    class="outline rounded bg-gray-700 outline-transparent max-w-[80vw] w-[800px] h-[200px] px-2 py-1"
                    name="prompt"
                    ref={setInputRef}
                />
                <button
                    disabled={loading()}
                    data-enabled={inputRef()?.value?.length || -1 > 0}
                    class="bg-blue-700 rounded px-3 py-2 data-[enabled=true]:bg-grey-100 "
                    onClick={updateData}
                >
                    {loading() ? "Wait" : "Submit"}
                </button>
            </div>
        </main>
    );
}
