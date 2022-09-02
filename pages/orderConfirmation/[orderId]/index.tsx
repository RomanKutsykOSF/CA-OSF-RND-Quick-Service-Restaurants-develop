import { GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import i18nInit from "i18";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import CheckoutOrderSummaryPanel from "components/checkout/CheckoutOrderSummaryPanel";
import Title from "components/UI/Title";
import TitleContentItems from "components/UI/TitleContentItems";
import { OrderConfirmationReceipt } from "interfaces/checkout";
import { CheckoutOrderSummaryProps } from "components/checkout/CheckoutOrderSummaryPanel";
import Button from "components/UI/Button";
import KeyValueItem from "components/UI/KeyValueItem";
import Divider from "components/UI/Divider";
import populateGlobalResources from "i18/populateGlobalResources";
import getOrderConfirmationDataFetcher, {
    getOrderConfirmationDataQuery,
} from "bdConnector/orderConfirmation/getOrderConfirmationData";
import useSWR from "swr";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { FetcherResponse } from "bdConnector/types";
import DotsLoader from "components/UI/DotsLoader";
import { StoreLocatorContext } from "context/storelocator";
import Head from "next/head";

export interface OrderConfirmationData {
    orderConfirmationReceipt: OrderConfirmationReceipt;
    orderConfirmationSummary: CheckoutOrderSummaryProps;
}

interface OrderConfirmationProps {
    i18: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
    globalResources: Record<string, string>;
    orderId: string;
}

const OrderConfirmation = ({
    i18,
    globalResources,
    locale,
    globalData,
    orderId,
}: OrderConfirmationProps): JSX.Element => {
    const [orderConfirmationDataAvailable, setOrderConfirmationDataAvailable] = useState(false);
    const globalContext = useContext(GlobalContext);
    const { selectedStore } = useContext(StoreLocatorContext);

    const { data: orderConfirmationData } = useSWR(
        [getOrderConfirmationDataQuery, orderId, locale],
        getOrderConfirmationDataFetcher
    );

    //Reset customer data filled by the user on checkout

    useEffect(() => {
        if (
            orderConfirmationData?.data?.orderConfirmationReceipt &&
            orderConfirmationData?.data?.orderConfirmationSummary
        ) {
            setOrderConfirmationDataAvailable(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderConfirmationData?.data?.orderConfirmationReceipt, orderConfirmationData?.data?.orderConfirmationSummary]);

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
                    {orderConfirmationDataAvailable ? (
                        <main className="py-14">
                            <section className="flex flex-col items-center lg:items-start lg:flex-row justify-center lg:mt-10">
                                <section className="grow-1 w-full">
                                    <Title alignment="left" type="h1">
                                        {i18.orderComplete}
                                    </Title>
                                    <Title alignment="left" type="h2" className="mt-5">
                                        {i18.receipt}
                                    </Title>
                                    <Divider />
                                    <section className="mt-6">
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.orderNumber}
                                            value={orderConfirmationData?.data?.orderConfirmationReceipt?.orderNumber}
                                        />
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.orderStatus}
                                            value={orderConfirmationData?.data?.orderConfirmationReceipt?.orderStatus}
                                        />
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.paymentStatus}
                                            value={orderConfirmationData?.data?.orderConfirmationReceipt?.paymentStatus}
                                        />
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.orderDate}
                                            value={new Date(
                                                orderConfirmationData?.data?.orderConfirmationReceipt?.orderDate
                                            ).toLocaleDateString()}
                                        />
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.storeNameText}
                                            value={orderConfirmationData?.data?.orderConfirmationSummary?.storeName}
                                        />
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.storeIdText}
                                            value={orderConfirmationData?.data?.orderConfirmationSummary?.storeId}
                                        />
                                        <KeyValueItem
                                            showTopMargin={true}
                                            name={i18.deliveryMethod}
                                            value={
                                                orderConfirmationData?.data?.orderConfirmationReceipt?.deliveryMethod
                                                    ?.name
                                            }
                                        />
                                        {orderConfirmationData?.data?.orderConfirmationReceipt?.deliveryMethod
                                            ?.isStorePickup === false ? (
                                            <KeyValueItem
                                                showTopMargin={true}
                                                name={i18.estiamtedDeliveryTime}
                                                value={
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.deliveryMethod?.estimatedArrivalTime
                                                }
                                            />
                                        ) : null}
                                    </section>

                                    {orderConfirmationData?.data?.orderConfirmationReceipt?.deliveryMethod
                                        ?.isStorePickup ? (
                                        <TitleContentItems
                                            className="mt-10"
                                            title={i18.pickupAddressText}
                                            items={[
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.address1,
                                                },
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.address2,
                                                },
                                            ]}
                                        />
                                    ) : (
                                        <TitleContentItems
                                            className="mt-10"
                                            title={i18.shippingAddress}
                                            items={[
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            .shippingAddress?.firstName +
                                                        " " +
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            .shippingAddress?.lastName,
                                                },
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.address1,
                                                },
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.address2,
                                                },
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.country,
                                                },
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.city,
                                                },
                                                {
                                                    text:
                                                        orderConfirmationData?.data?.orderConfirmationReceipt
                                                            ?.shippingAddress.zip,
                                                },
                                            ]}
                                        />
                                    )}

                                    <TitleContentItems
                                        className="mt-10"
                                        title={i18.billingAddress}
                                        items={[
                                            {
                                                text:
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress?.firstName +
                                                    " " +
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress?.lastName,
                                            },
                                            {
                                                text:
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress.address1,
                                            },
                                            {
                                                text:
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress.address2,
                                            },
                                            {
                                                text:
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress.country,
                                            },
                                            {
                                                text:
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress.city,
                                            },
                                            {
                                                text:
                                                    orderConfirmationData?.data?.orderConfirmationReceipt
                                                        ?.billingAddress.zip,
                                            },
                                        ]}
                                    />

                                    <TitleContentItems
                                        className="mt-10"
                                        title={i18.phone}
                                        items={[{ text: orderConfirmationData?.data?.orderConfirmationReceipt?.phone }]}
                                    />

                                    {!globalContext.isUserLoggedIn && (
                                        <>
                                            <p className="font-primary text-lg font-bold my-4">
                                                {i18.trackOrderGuestText}
                                            </p>
                                            <div className="w-full text-sm p-2 border border-bgr-tertiary-faded h-11">
                                                {`${window.location.protocol}//${window.location.host}/orderStatus/${orderConfirmationData?.data?.orderConfirmationReceipt?.orderNumber}/${orderConfirmationData?.data?.orderConfirmationReceipt?.shippingAddress?.phone}/${orderConfirmationData?.data?.orderConfirmationReceipt?.orderDate}`}
                                            </div>
                                        </>
                                    )}
                                </section>
                                <CheckoutOrderSummaryPanel
                                    taxTotal={orderConfirmationData.data.orderConfirmationSummary.taxTotal}
                                    shippingTotal={orderConfirmationData.data.orderConfirmationSummary.shippingTotal}
                                    totalTaxText={i18.totalTaxText}
                                    className="lg:ml-8 mt-5 lg:mt-0"
                                    quantityText={globalResources?.quantityText}
                                    title={`${orderConfirmationData?.data?.orderConfirmationSummary?.orderItems?.length} items`}
                                    orderItems={orderConfirmationData?.data?.orderConfirmationSummary?.orderItems}
                                    deliveryText={i18.deliveryFeeText}
                                    subtotalText={i18.subtotalText}
                                    subtotal={orderConfirmationData?.data?.orderConfirmationSummary?.subtotal}
                                    totalText={i18.totalText}
                                    total={orderConfirmationData?.data?.orderConfirmationSummary?.total}
                                    desktopViewport={globalContext.viewports.large}
                                />
                            </section>
                            <Button
                                className="mt-10"
                                type="button"
                                variant="primary"
                                link={selectedStore ? `/store/${selectedStore.id}` : "/"}
                            >
                                {i18.continueShopping}
                            </Button>
                        </main>
                    ) : (
                        <div className="flex justify-center items-center min-h-screen">
                            <DotsLoader variant="dark" />
                        </div>
                    )}
                </CenterContentWrapper>
            </MainLayout>
        </>
    );
};

export const getServerSideProps = async ({
    locale,
    params,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<OrderConfirmationProps>> => {
    let i18n: any;
    const orderId = params?.orderId.toString();

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during Order confirmation i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            orderId,
            globalData,
            i18: {
                orderComplete: i18n.t("orderConfirmation:orderComplete"),
                receipt: i18n.t("orderConfirmation:receipt"),
                orderNumber: i18n.t("orderConfirmation:orderNumber"),
                orderDate: i18n.t("orderConfirmation:orderDate"),
                deliveryDate: i18n.t("orderConfirmation:deliveryDate"),
                scheduledDeliveryTime: i18n.t("orderConfirmation:scheduledDeliveryTime"),
                shippingAddress: i18n.t("orderConfirmation:shippingAddress"),
                billingAddress: i18n.t("orderConfirmation:billingAddress"),
                phone: i18n.t("orderConfirmation:phone"),
                payment: i18n.t("orderConfirmation:payment"),
                continueShopping: i18n.t("orderConfirmation:continueShopping"),
                orderStatus: i18n.t("orderConfirmation:orderStatus"),
                paymentStatus: i18n.t("orderConfirmation:paymentStatus"),
                deliveryFeeText: i18n.t("checkout:deliveryFeeText"),
                subtotalText: i18n.t("checkout:subtotalText"),
                totalText: i18n.t("checkout:totalText"),
                totalTaxText: i18n.t("checkout:totalTaxText"),
                pageTitile: i18n.t("orderConfirmation:pageTitile"),
                deliveryMethod: i18n.t("orderConfirmation:deliveryMethod"),
                estiamtedDeliveryTime: i18n.t("orderConfirmation:estiamtedDeliveryTime"),
                pickupAddressText: i18n.t("orderConfirmation:pickupAddressText"),
                storeNameText: i18n.t("orderConfirmation:storeNameText"),
                storeIdText: i18n.t("orderConfirmation:storeIdText"),
                trackOrderGuestText: i18n.t("orderConfirmation:trackOrderGuestText"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default OrderConfirmation;
