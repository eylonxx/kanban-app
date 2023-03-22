import { Listbox, Transition } from "@headlessui/react";
import { type Column } from "@prisma/client";
import { Fragment, useRef } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const SelectWithListbox = ({
  selected,
  onChange,
  columns,
}: {
  selected: string;
  onChange: (newSelected: string) => void;
  columns: Column[];
}) => {
  const ref = useRef<HTMLSelectElement | null>(null);
  return (
    <>
      <select style={{ display: "none" }} ref={ref} />
      <div className="w-full">
        <Listbox
          value={selected}
          onChange={(newSelected) => {
            onChange(newSelected);
            if (ref.current) {
              ref.current.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }}
        >
          <div className="relative mt-1 rounded-md border-2 border-inputBorder">
            <Listbox.Button className="focus-visible:border-indigo-500 focus-visible:ring-offset-orange-300 relative h-10 w-full cursor-default rounded-lg bg-darkGrey py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
              <span className="block truncate">
                {columns.find((col) => col.id === selected)!.title}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-mainPurple"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md border-2 border-inputBorder bg-darkGrey py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {columns.map((col) => (
                  <Listbox.Option
                    key={col.index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={col.id}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate text-left 
                          ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {col.title}
                        </span>
                        {selected ? (
                          <span className="text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </>
  );
};
export default SelectWithListbox;
