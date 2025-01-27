import { createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(2);
  return (
    <button
      class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]"
      onClick={() => setCount(c => c * 2)}
    >
      Clicks: {count()}
    </button>
  );
}
