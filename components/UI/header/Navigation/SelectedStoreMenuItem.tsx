import { Menu, Transition } from "@headlessui/react";
import { Store } from "interfaces/storelocatorContext";
import Link from "next/link";
import { Fragment } from "react";

const SelectedStoreMenuItem = ({ selectedStore }: { selectedStore: Store }): JSX.Element => {
    return (
        <>
            {selectedStore && (
                <Menu as="div" className={`relative mx-4 rounded-xl lg:inline-block text-left`}>
                    <Menu.Button
                        className={`text mb-2
                -t-primary lg:mb-0 bg-bgr-tertiary-faded justify-center w-full pr-4 pl-10 py-2 text-sm rounded-xl`}
                    >
                        {selectedStore.name}
                        <i className="icon-store-1 absolute left-14 lg:left-2 w-1 text-lg mr-2" />
                        <i className="icon-chevron-down w-1 text-lg ml-2" />
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            as="ul"
                            className="absolute z-50 p-2 right-0 w-full lg:w-56 mt-2 origin-top-right bg-bgr-primary shadow-md border-t-primary border rounded-xl"
                        >
                            <Menu.Item as="li">
                                {({ active }) => (
                                    <Link href={`/store/${selectedStore.id}`}>
                                        <a
                                            className={`${
                                                active ? "bg-bgr-tertiary text-t-tertiary" : "text-t-primary"
                                            } flex focus:bg-bgr-tertiary focus:text-t-tertiary rounded-md items-center w-full px-3 py-2 text-sm hover:bg-bgr-tertiary hover:text-t-tertiary`}
                                        >
                                            Store Menu
                                        </a>
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item as="li">
                                {({ active }) => (
                                    <Link href={"/storelocator"}>
                                        <a
                                            className={`${
                                                active ? "bg-bgr-tertiary text-t-tertiary" : "text-t-primary"
                                            } flex focus:bg-bgr-tertiary focus:text-t-tertiary rounded-md items-center w-full px-3 py-2 text-sm hover:bg-bgr-tertiary hover:text-t-tertiary`}
                                        >
                                            Change Store
                                        </a>
                                    </Link>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            )}
        </>
    );
};

export default SelectedStoreMenuItem;
