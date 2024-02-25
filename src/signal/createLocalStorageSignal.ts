import { Accessor, Setter, createSignal } from 'solid-js';
import { makePersisted } from '@solid-primitives/storage'


export default function createLocalStorageSignal<T extends Record<string, any> | any[]>(
    key: string,
    initialValue: T
): [Accessor<T>, Setter<T>] {

    return makePersisted(createSignal<T>(initialValue), { name: key });
}
