import { JSX } from "solid-js";

type EventHandler = (e: Event & { target: HTMLSelectElement }) => void;

type Props = {
  value: string;
  onChange: EventHandler;
  children: JSX.Element[];
  disabled?: boolean;
}


export const Select = ({
  value,
  onChange,
  children,
  disabled,
}: Props) => {

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={onChange}
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      {children}
      <option value="alloy">alloy</option>
      <option value="echo">echo</option>
      <option value="fable">fable</option>
      <option value="onyx">onyx</option>
      <option value="nova">nova</option>
      <option value="shimmer">shimmer</option>
    </select>
  )
}