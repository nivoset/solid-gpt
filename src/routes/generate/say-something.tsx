import { Match, Switch, createSignal } from "solid-js";
import wretch from 'wretch'
import { makePersisted } from '@solid-primitives/storage'
import { Select } from "~/components/Select";


export default function GenerateCode() {
    const [store, setStore] = createSignal<null | Blob>(null);
    const [loading, setLoading] = createSignal(false);
    const [value, setValue] = makePersisted(createSignal(''), { name: 'chat' });
    const [voice, setVoice] = makePersisted(createSignal('alloy'), { name: 'chat voice' });

    const updateData = async () => {
        setLoading(true);
        const text = value();

        const res = await wretch("/api/ai/say-something").post({ text, voice: voice() }).blob();
        // clean input value
        setStore(res);

        setLoading(false);2
    };

    return (
        <main class="flex flex-col gap-3 justify-center items-center">
            <h1 class="max-6-xs text-6xl text-sky-300 font-thin capitalize my-16">
                generate Chat
            </h1>
            <article class="flex flex-col">
              <Switch fallback={<>start your chat...</>}>
                <Match when={store()}>
                  <span>{store()?.size}</span>
                </Match>
              </Switch>

            </article>
            <div class="flex flex-col gap-2">
              <Select
                value={voice()}
                disabled={loading()}
                onChange={(e) => setVoice(e.target.value)}
              >
                <option value="alloy">alloy</option>
                <option value="echo">echo</option>
                <option value="fable">fable</option>
                <option value="onyx">onyx</option>
                <option value="nova">nova</option>
                <option value="shimmer">shimmer</option>
              </Select>
            <div class="grid grid-cols-[90fr_10fr] group outline outline-transparent focus-within:outline-blue-400  shadow shadow-slate-900 rounded">
                <textarea
                    disabled={loading()}
                    class="outline rounded bg-gray-700 outline-transparent  w-[800px] h-[200px] px-2 py-1"
                    name="prompt"
                    value={value()}
                    onChange={(e) => setValue(e.currentTarget.value)}
                />
                <button
                    disabled={loading()}
                    data-enabled={value().length > 0}
                    class="bg-blue-700 rounded px-3 py-2 data-[enabled=true]:bg-grey-100 "
                    onClick={updateData}
                >
                    {loading() ? "Wait" : "Submit"}
                </button>
            </div>
            </div>
        </main>
    );
}
