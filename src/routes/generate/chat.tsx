import { For, createSignal } from "solid-js";
import { z } from 'zod'
import createLocalStorageSignal from '~/signal/createLocalStorageSignal';

type Content = { who: string; text: string; finishReason: string };

const apiSchema = z
    .object({
        index: z.number(),
        finish_reason: z.string(),
        message: z.object({
            role: z.string(),
            content: z.string(),
        })
    })
    .array();


export default function GenerateCode() {
    const [store, setStore] = createLocalStorageSignal<Content[]>('conversation', []);
    const [inputRef, setInputRef] = createSignal<HTMLTextAreaElement>()
    const [loading, setLoading] = createSignal(false);

    const updateData = async () => {
        setLoading(true);
        const ref = inputRef();
        if (!ref) return
        const text = ref.value;
        setStore(p => [...p, ({
          text,
          who: 'me',
          finishReason: 'submit'
        })])

        const res = await fetch("/api/ai/chat", { method: "post", body: text, }).then((r) => r.json())
        const parsed = await apiSchema.parse(res);

        console.table(parsed)
        // clean input value
        ref.value = ''
        setStore((p) => [
            ...p,
            {
                who: "bot",
                text: parsed[0].message.content,
                finishReason: parsed[0].finish_reason,
            },
        ]);

        setLoading(false);
    };

    return (
        <main class="flex flex-col gap-3 justify-center items-center">
            <h1 class="max-6-xs text-6xl text-sky-300 font-thin capitalize my-16">
                generate Chat
            </h1>
            <article class="flex flex-col">
                <For each={store()} fallback={<>start your chat...</>}>
                    {(item) => (
                      <>
                        <div class="flex gap-2 flex-wrap text-sm">
                          <span class="font-bold uppercase">{item.who}:</span>
                          <p class="max-w-prose">{item.text}</p>
                        </div>
                        <span class="text-sm flex gap-3">
                          <span>
                            Finish reason:
                          </span>
                          <span class="bg-black text-white px-2 py-0 rounded">
                            {item.finishReason}
                          </span>
                        </span>
                      </>
                    )}
                </For>
            </article>
            <div class="grid grid-cols-[90fr_10fr] group outline outline-transparent focus-within:outline-blue-400  shadow shadow-slate-900 rounded">
                <textarea
                    disabled={loading()}
                    class="outline rounded bg-gray-700 outline-transparent  w-[800px] h-[200px] px-2 py-1"
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
