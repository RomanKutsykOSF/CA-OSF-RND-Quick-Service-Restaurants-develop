import React, { Fragment, useState } from "react";
import Title from "components/UI/Title";
import { AccountNavigationItemProps } from "./AccountNavigationItem";
import { Listbox, Transition } from "@headlessui/react";
import Link from "next/link";

export interface AccountNavigation {
    title: string;
    items: AccountNavigationItemProps[];
    logoutText: string;
    logoutCallback: () => void;
}
const ButtonList = ({ title, items, logoutText, logoutCallback }: AccountNavigation): JSX.Element => {
    let activeItem;
    const slidesList = items.map((tileData, index) => {
        if (tileData.isActive) {
            activeItem = tileData;
        }
        return (
            <div key={index}>
                <Listbox.Option
                    key={index}
                    className={`${tileData.isActive ? "text-t-disabled" : "text-t-primary"}
                          cursor-default select-none relative py-2 pl-10 pr-4`}
                    value={tileData.title}
                >
                    <span className={"font-normal block truncate"}>
                        <Link href={tileData.link}>
                            <button>{tileData.title}</button>
                        </Link>
                    </span>
                </Listbox.Option>
            </div>
        );
    });

    const [selected, setSelected] = useState(activeItem);

    return (
        <div>
            <Title type="h1" alignment="left" className="my-2">
                {title}
            </Title>
            <div className="w-full top-16">
                <Listbox value={selected} onChange={(value) => setSelected(value)}>
                    <div className="relative mt-1">
                        <Listbox.Button className="w-full py-2 pl-3 pr-10 text-left bg-bgr-tertiary-faded rounded-full cursor-default focus:outline-none ">
                            <span className="ml-3 block truncate">{selected.title}</span>
                            <span className="absolute inset-y-0 right-3 text-lg flex items-center pointer-events-none">
                                <i className="icon-chevron-down text-t-primary" aria-hidden="false" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="relative w-full py-1 mt-1 overflow-auto text-base bg-bgr-faded rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {slidesList}
                                <Listbox.Option
                                    as="span"
                                    value={logoutText}
                                    className={"text-t-primary cursor-default select-none relative pl-10 pr-4"}
                                >
                                    <button onClick={logoutCallback} className={"mt-2"}>
                                        {logoutText}
                                    </button>
                                </Listbox.Option>
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        </div>
    );
};
export default ButtonList;
