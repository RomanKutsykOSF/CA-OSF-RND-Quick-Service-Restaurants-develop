import React, { useContext } from "react";
import i18nInit from "i18";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import OrderSummary from "components/cart/OrderSummary";
import LineItems from "components/cart/LineItems";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import populateGlobalResources from "i18/populateGlobalResources";
import updateLineItemQty, { updateLineItemQtyMutation } from "bdConnector/cart/updateLineItemQty";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { FetcherResponse } from "bdConnector/types";
import Button from "components/UI/Button";
import Head from "next/head";
import DotsLoader from "components/UI/DotsLoader";

interface CartProps {
    i18: Record<string, string>;
    locale: string;
    globalResources: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
}

const Cart = ({ i18, locale, globalData, globalResources }: CartProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <>
            <Head>
                <title>{i18.pageTitle}</title>
                <meta property="og:title" content={i18.pageTitle} key="title" />
            </Head>
            <MainLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                locale={locale}
            >
                <CenterContentWrapper>
                    {globalContext?.basket?.productItems?.length && !globalContext.cartValidating ? (
                        <>
                            <div className="lg:mb-20 lg:grid grid-cols-3 gap-x-5">
                                <>
                                    <LineItems
                                        title={i18.title}
                                        items={globalContext?.basket?.productItems || []}
                                        removeItemText={i18.removeItem}
                                        itemsTotalSuffixMultipleText={i18.itemsTotalSuffixMultiple}
                                        itemsTotalSuffixSingleText={i18.itemsTotalSuffixSingle}
                                        quantityChangeFunction={async (lineItemId, quantity, locale) => {
                                            const updateLineItemRes = await updateLineItemQty(
                                                updateLineItemQtyMutation,
                                                lineItemId,
                                                quantity,
                                                locale,
                                                globalContext?.basket?.basketId
                                            );

                                            return updateLineItemRes;
                                        }}
                                        quantityUpdateCallback={(updatedCartData) => {
                                            globalContext.useSwrGetCartMutate({ data: { ...updatedCartData } }, false);
                                        }}
                                        locale={locale}
                                    />

                                    <OrderSummary
                                        taxTotal={globalContext.basket?.taxTotal}
                                        totalTaxText={i18.totalTaxText}
                                        totalText={i18.total}
                                        total={globalContext?.basket?.orderTotal}
                                        subtotalText={i18.subtotal}
                                        subtotal={globalContext?.basket?.productSubTotal}
                                        btnPath="/checkout"
                                        btnText={i18.checkoutText}
                                    />
                                </>
                            </div>
                        </>
                    ) : !globalContext?.basket?.productItems?.length && !globalContext.cartValidating ? (
                        <div className="flex justify-center flex-col items-center min-h-custom">
                            <h1 className="text-center text-2xl font-bold">{i18.emptyCart}</h1>
                            <Button className="mt-10" type="button" variant="primary" link="/">
                                {i18.continueShopping}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-center flex-col items-center min-h-custom">
                            <DotsLoader variant="dark" />
                        </div>
                    )}
                </CenterContentWrapper>
            </MainLayout>
            <style jsx>
                {`
                    .min-h-custom {
                        min-height: calc(100vh - (65px + 294px));
                    }
                `}
            </style>
        </>
    );
};

export const getStaticProps = async ({ locale }: GetStaticPropsContext): Promise<GetStaticPropsResult<CartProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during cart i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                title: i18n.t("cart:title"),
                backCtaText: i18n.t("cart:backCtaText"),
                itemsTotalSuffixSingle: i18n.t("cart:itemsTotalSuffixSingle"),
                itemsTotalSuffixMultiple: i18n.t("cart:itemsTotalSuffixMultiple"),
                removeItem: i18n.t("cart:removeItem"),
                total: i18n.t("cart:total"),
                subtotal: i18n.t("cart:subtotal"),
                deliveryFee: i18n.t("cart:deliveryFee"),
                checkoutText: i18n.t("cart:checkoutText"),
                continueShopping: i18n.t("cart:continueShopping"),
                emptyCart: i18n.t("cart:emptyCart"),
                totalTaxText: i18n.t("cart:totalTaxText"),
                pageTitle: i18n.t("cart:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Cart;
