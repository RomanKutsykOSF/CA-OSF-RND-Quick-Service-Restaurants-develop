import React, { useContext } from "react";
import { GlobalContext } from "context/global";
import { Basket, ProductLineItem } from "interfaces/globalContext";

import Button from "components/UI/Button";
import MinicartLineItem from "./MinicartLineItem";
import { FetcherResponse } from "bdConnector/types";

export interface Minicart {
    title: string;
    items: ProductLineItem[];
    itemsCountText: string;
    totalText: string;
    totalValue: string;
    checkoutText: string;
    checkoutPath: string;
    cartText: string;
    cartPath: string;
    removeText: string;
    taxTotal: string;
    taxTotalText: string;
    deliveryFee: string;
    deliveryFeeText: string;
    locale: string;
    quantityChangeFunction: (lineItemId: string, newQty: number, locale: string) => Promise<FetcherResponse<Basket>>;
    serverError: string;
}

const Minicart = ({
    title,
    items,
    itemsCountText,
    totalText,
    totalValue,
    removeText,
    checkoutText,
    checkoutPath,
    cartText,
    cartPath,
    locale,
    quantityChangeFunction,
    serverError,
    deliveryFee,
    deliveryFeeText,
    taxTotal,
    taxTotalText,
}: Minicart): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const updateLineItemQtyDecorator = async (
        lineItemId: string,
        newQty: number,
        locale: string
    ): Promise<void | Basket> => {
        const { data, errorCode } = await quantityChangeFunction(lineItemId, newQty, locale);

        if (errorCode) {
            return globalContext.showNotification({
                type: "error",
                message: serverError,
                autoClose: true,
            });
        }

        return data;
    };

    const itemNodes = items?.map((item) => {
        return (
            <MinicartLineItem
                itemId={item.itemId}
                key={item.itemId}
                ingredientsString={item?.ingredientsString}
                productName={item.productName}
                price={item.price}
                productId={item.productId}
                quantity={item.quantity}
                size={item.size || "small"}
                image={item.image || ""}
                minQty={item.minQty}
                maxQty={item.maxQty}
                locale={locale}
                updateLineItemQty={updateLineItemQtyDecorator}
                quantityUpdateCallback={(updatedCartData: Basket) => {
                    globalContext.useSwrGetCartMutate({ data: { ...updatedCartData } }, false);
                }}
                removeText={removeText}
            />
        );
    });

    return (
        <>
            <div className="relative minicart lg:ml-0">
                <Button
                    variant="primary"
                    cssIconClass="icon-shopping-bag"
                    onClick={() => globalContext.setMinicartExpanded(!globalContext.isMinicartExpanded)}
                />
                {globalContext.isMinicartExpanded && (
                    <>
                        <button
                            className="w-full h-full minicart__background"
                            onClick={() => globalContext.setMinicartExpanded(false)}
                        />
                        <div className="absolute right-0 rounded-3xl shadow-md minicart__overlay">
                            <div className="px-6 py-3 relative">
                                {itemNodes && <div className="shadow shadow__bottom" />}
                                <div className="flex justify-between">
                                    <p className="m-0 whitespace-nowrap font-bold text-lg">{title}</p>
                                    <Button
                                        variant="close"
                                        cssIconClass="icon-cross"
                                        onClick={() => globalContext.setMinicartExpanded(false)}
                                    />
                                </div>
                                <p className="mb-2 text-sm">{itemsCountText}</p>
                            </div>
                            {itemNodes && <ul className="px-6 minicart__items">{itemNodes}</ul>}
                            <div className="px-6 py-3 relative top-custom-border">
                                {itemNodes && <div className="shadow shadow__top" />}
                                {deliveryFee && (
                                    <div className="mt-2 flex justify-between">
                                        <span className="text-xs">{deliveryFeeText}</span>
                                        <span className="font-bold text-xs">{deliveryFee}</span>
                                    </div>
                                )}
                                {taxTotal && (
                                    <div className="mt-2 flex justify-between">
                                        <span className="text-xs">{taxTotalText}</span>
                                        <span className="font-bold text-xs">{taxTotal}</span>
                                    </div>
                                )}
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-sm">{totalText}</span>
                                    <span className="font-bold text-lg">{totalValue}</span>
                                </div>

                                <Button
                                    variant="primary"
                                    link={checkoutPath}
                                    className="mt-2 w-full"
                                    onClick={() => globalContext.setMinicartExpanded(false)}
                                >
                                    {checkoutText}
                                </Button>
                                <Button
                                    variant="outline-custom"
                                    link={cartPath}
                                    className="mt-2 w-full"
                                    onClick={() => globalContext.setMinicartExpanded(false)}
                                >
                                    {cartText}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <style jsx>{`
                .minicart__overlay {
                    min-width: 300px;
                    top: calc(100% + 28px);
                    transition: 250ms;
                    z-index: 2;
                    background-color: var(--bgr-primary);
                }

                .minicart__items {
                    max-height: 300px;
                    overflow-y: scroll;
                }

                .shadow::before,
                .shadow::after {
                    display: block;
                    content: "";
                    position: absolute;
                }

                .shadow__bottom::before {
                    bottom: -5px;
                    background: linear-gradient(to bottom, rgb(191 191 191 / 40%), rgba(0, 0, 0, 0));
                    width: 100%;
                    left: 0;
                    height: 5px;
                }

                .shadow__top::after {
                    top: -5px;
                    background: linear-gradient(to top, rgb(191 191 191 / 40%), rgba(0, 0, 0, 0));
                    width: 100%;
                    left: 0;
                    height: 5px;
                }

                .minicart__background {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                }

                @media (min-width: ${globalContext.viewports.large}px) {
                    .minicart__items {
                        max-height: 400px;
                    }
                }
            `}</style>
        </>
    );
};

export default Minicart;
