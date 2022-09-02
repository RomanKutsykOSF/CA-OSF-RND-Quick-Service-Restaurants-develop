import { Transition, Dialog } from "@headlessui/react";
import DotsLoader from "components/UI/DotsLoader";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import { CategorySearchItemInterface, ProductSearchItemInterface } from "interfaces/globalContext";
import Image from "next/image";
import React, { Fragment, useRef } from "react";
import { ChangeEvent } from "react";
import { debounce } from "utils";

interface SearchSuggestionsProps {
    placeholderText: string;
    categoriesTileText: string;
    productsTileText: string;
    isExpanded: boolean;
    productResults: ProductSearchItemInterface[];
    categoryResults: CategorySearchItemInterface[];
    searchCallbackFunction: (searchText: string) => void;
    setIsExpanded: (state: boolean) => void;
    isFetching: boolean;
    noResultsText: string;
    productNotAvailableText: string;
}

const SearchSuggestions = ({
    isExpanded,
    categoriesTileText,
    placeholderText,
    productResults,
    categoryResults,
    isFetching,
    setIsExpanded,
    productsTileText,
    searchCallbackFunction,
    noResultsText,
    productNotAvailableText,
}: SearchSuggestionsProps): JSX.Element => {
    const searchInputRef = useRef(null);
    return (
        <>
            <Transition appear show={isExpanded} as={Fragment}>
                <Dialog
                    as="div"
                    initialFocus={searchInputRef}
                    className="fixed bottom-0 right-0 left-0 z-10 overflow-y-auto"
                    onClose={() => setIsExpanded(false)}
                >
                    <div className="height-custom lg:pt-8 p-12 overflow-y-scroll lg:px-4 px-1 bg-bgr-primary">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="max-w-3xl m-auto">
                                <CenterContentWrapper>
                                    <div className="relative flex items-center justify-center h-14">
                                        <i className="icon-search block absolute left-3 text-xl" />
                                        <input
                                            ref={searchInputRef}
                                            className={
                                                "rounded-3xl h-full pl-14 text-t-secondary focus:border-br-disabled placeholder-t-disabled outline-none border-2 border-br-secondary w-full"
                                            }
                                            type="text"
                                            onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
                                                searchCallbackFunction(e?.target?.value);
                                            }, 500)}
                                            placeholder={placeholderText}
                                        />
                                    </div>
                                    <div className="mt-8">
                                        {!isFetching ? (
                                            <>
                                                {productResults.length ? (
                                                    <>
                                                        <p className="font-primary font-bold text-lg">
                                                            {productsTileText}
                                                        </p>
                                                        <div className="md:grid grid-cols-2">
                                                            {productResults.map((el) => {
                                                                return (
                                                                    <button
                                                                        disabled={!el.isAvailableInStore}
                                                                        className={`text-left ${
                                                                            !el.isAvailableInStore
                                                                                ? "product-unavailable"
                                                                                : ""
                                                                        }`}
                                                                        key={el.id}
                                                                        onClick={() => {
                                                                            window.location.href = el.link;
                                                                            setIsExpanded(false);
                                                                        }}
                                                                    >
                                                                        <div className="flex my-4 cursor-pointer">
                                                                            <div className={"image-wrapper"}>
                                                                                <Image
                                                                                    className="rounded-lg"
                                                                                    src={el.image.link}
                                                                                    alt={el.image.alt}
                                                                                    title={el.image.title}
                                                                                    width={58}
                                                                                    height={58}
                                                                                />
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <span className="block text-lg font-primary font-bold">
                                                                                    {el.name}
                                                                                </span>
                                                                                <span className="block text-sm text-t-secondary">
                                                                                    {el.isAvailableInStore
                                                                                        ? el.price
                                                                                        : productNotAvailableText}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                ) : null}

                                                {categoryResults.length ? (
                                                    <>
                                                        <p className="font-primary font-bold text-lg mt-6 mb-4">
                                                            {categoriesTileText}
                                                        </p>
                                                        <div className="md:grid grid-cols-2">
                                                            {categoryResults &&
                                                                categoryResults.map((el) => {
                                                                    return (
                                                                        <button
                                                                            key={el.id}
                                                                            onClick={() => {
                                                                                window.location.href = `${window.location.protocol}//${window.location.host}/store/${el.id}/products`;
                                                                                setIsExpanded(false);
                                                                            }}
                                                                        >
                                                                            <span className="block my-2 text-left cursor-pointer">
                                                                                {el.name}
                                                                            </span>
                                                                        </button>
                                                                    );
                                                                })}
                                                        </div>
                                                    </>
                                                ) : null}

                                                {!productResults.length && !categoryResults.length ? (
                                                    <div>
                                                        <p className="font-primary text-sm text-center no-results">
                                                            {noResultsText}
                                                        </p>
                                                    </div>
                                                ) : null}
                                            </>
                                        ) : (
                                            <div className="flex justify-center">
                                                <DotsLoader variant="dark" />
                                            </div>
                                        )}
                                    </div>
                                </CenterContentWrapper>
                            </div>
                        </Transition.Child>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="icon-cross absolute lg:right-14 lg:top-4 right-0 top-0 text-2xl text-t-secondary"
                        />
                    </div>
                </Dialog>
            </Transition>
            <style jsx>{`
                .height-custom {
                    height: calc(100vh - 4rem);
                }

                .product-unavailable {
                    filter: grayscale(100%);
                }

                .image-wrapper {
                    min-width: 58px;
                    max-height: 58px;
                }
            `}</style>
        </>
    );
};

export default SearchSuggestions;
