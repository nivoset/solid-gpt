
import { isServer } from 'solid-js/web'
import { Peer } from 'peerjs';
import { For, createSignal } from "solid-js";
import { nanoid } from 'nanoid'
import {z} from 'zod';

type Content = { who: string; text: string; };

const apiSchema = z
    .object({
        text: z.string(),
        finish_reason: z.string(),
    })
    .array();


export default function StartChat() {
    const id = 'jhbfkgryjbvegluyhcvlausyevtrilbsuhncluhyfvgizhsbdchgbkb';
    const [store, setStore] = createSignal<Content[]>([]);
    const [inputRef, setInputRef] = createSignal<HTMLTextAreaElement>()
    const [loading, setLoading] = createSignal(false);

    const [peer, setPeer] = createSignal<Peer | null>(null);

    if (!isServer) {
      setPeer(new Peer(id));
      //const conn = peer();
      peer()?.on("connection", (conn) => {
        conn.on("data", (data) => {
          // Will print 'hi!'
          console.log(data);
        });
        conn.on("open", () => {
          conn.send("hello!");
          console.log('open')
        });
        conn.on('error', (err) => {
          console.error(err);
        })
      });
    }
    setInterval(() => {
      console.log(peer()?.open)
      // peer()?.listAllPeers((list) => console.table(list))
    }, 5000)

    const updateData = async () => {
        setLoading(true);
        const ref = inputRef();
        if (!ref) return
        const text = ref.value;
        setStore(p => [...p, ({
          text,
          who: 'me'
        })])

        // const res = await fetch("/api/ai/chat", { method: "post", body: text, }).then((r) => r.json())
        // const parsed = await apiSchema.parse(res);

        // console.table(parsed)
        // // clean input value
        // ref.value = ''
        // setStore((p) => [
        //     ...p,
        //     {
        //         who: "bot",
        //         text: parsed[0].text
        //     },
        // ]);

        setLoading(false);
    };

    return (
        <main class="flex flex-col gap-3 justify-center items-center">
            <h1 class="max-6-xs text-6xl text-sky-300 font-thin capitalize my-16">
                Start Chat "{id}"
            </h1>
            <article class="flex flex-col">
                <For each={store()} fallback={<>start your chat...</>}>
                    {(item) => (
                      <>
                        <div class="flex gap-2 flex-wrap text-sm">
                          <span class="font-bold uppercase">{item.who}:</span>
                          <pre class="max-w-prose">{item.text}</pre>
                        </div>
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
