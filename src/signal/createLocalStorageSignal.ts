import { Accessor, Setter, createSignal } from 'solid-js';

export function createLocalStorageSignal<T extends Record<string, any> | any[]>(
    key: string,
    initialValue: T
): T extends (...args: never) => unknown
    ? unknown
    : [get: Accessor<T>, set: Setter<T>];
export default function createLocalStorageSignal<T extends Record<string, any> | any[]>(
    key: string,
    initialValue: T
): [Accessor<T>, Setter<T>] {
    // const storage = global.localStorage;
    // const st = storage?.getItem(key);
    
    // const initialValue: T = st ? JSON.parse(st)?.value : initialVal;

    const [value, setValue] = createSignal<T>(initialValue);

    const newSetValue = (newValue: T | ((v: T) => T)): T => {
        const _val: T =
            typeof newValue === "function" ? newValue(value()) : newValue;

        setValue(_val as any);
        // storage?.setItem(key, JSON.stringify({ value: _val }));

        return _val;
    };

    return [value, newSetValue as Setter<T>];
}
