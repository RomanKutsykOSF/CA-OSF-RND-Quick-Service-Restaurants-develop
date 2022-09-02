import React, { useContext, useEffect, useState } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import OrdersAccordionItem, { OrderDataInterface } from "components/UI/OrdersAccordionItem";
import populateGlobalResources from "i18/populateGlobalResources";
import ButtonList from "components/UI/ButtonList";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import useSWR from "swr";
import getUserOrdersFetcher, { getUserOrdersQuery } from "bdConnector/account/getOrders";
import { GlobalData } from "interfaces/globalContext";
import { handleLogout } from "utils";
import { FetcherResponse } from "bdConnector/types";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import DotsLoader from "components/UI/DotsLoader";
import Head from "next/head";
import Modal from "components/UI/ModalPopup";
import OrderItem from "components/UI/OrderItem";
import reorderFetcher, { reorderQuery } from "bdConnector/cart/reorder";
import { StoreLocatorContext } from "context/storelocator";
import getStoreByIdFetcher, { getStoreByIdQuery } from "bdConnector/storeLocator/getStoreById";
import { useRouter } from "next/router";
import setSelectedStoreIdFetcher, { setSelectedStoreIdMutation } from "bdConnector/storeLocator/setSelectedStore";
import getProductsFromOrderFetcher, { getProductsFromOrderQuery } from "bdConnector/cart/getProductsFromOrder";

interface AccountProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
    locale: string;
}

const Orders = ({ i18, globalResources, globalData, locale }: AccountProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const { selectedStore } = useContext(StoreLocatorContext);
    const { data: useSwrOrdersData, isValidating } = useSWR([getUserOrdersQuery, locale], getUserOrdersFetcher, {
        revalidateOnFocus: false,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState<{
        type: "reorder" | "changeStore";
        data: any;
    }>(null);
    const [selectedOrderForReorderData, setSelectedOrderForReorderData] = useState<OrderDataInterface>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingModalData, setLoadingModalData] = useState(false);
    const router = useRouter();
    const [i18Fd, setI18Fd] = useState(null);

    useEffect(() => {
        i18nInit(locale)
            .then((i18Fd) => {
                setI18Fd(i18Fd);
            })
            .catch((e) => {
                console.log("Error during account orders page i18n initialization:", e);
            });
    }, [locale]);

    const accountSidebarItems = [
        {
            title: i18.accountNavigationProfileText,
            link: "/account/profile",
            isActive: false,
        },
        {
            title: i18.accountNavigationAddressesText,
            link: "/account/address",
            isActive: false,
        },
        {
            title: i18.accountNavigationOrdersText,
            link: "/account/orders",
            isActive: true,
        },
        {
            title: i18.accountNavigationPasswordText,
            link: "/account/password",
            isActive: false,
        },
    ];

    if (globalData.data.sitePreferences.isWishlistEnabled) {
        accountSidebarItems.push({
            title: i18.accountNavigationWishlistText,
            link: "/account/wishlist",
            isActive: false,
        });
    }

    const handleModalData = async (order: OrderDataInterface): Promise<void> => {
        setLoadingModalData(true);
        setSelectedOrderForReorderData(order);

        if (selectedStore && selectedStore?.id === order.storeId) {
            const { data } = await getProductsFromOrderFetcher(getProductsFromOrderQuery, locale, order?.orderNumber);

            const allProductsUnavailable = data.productItems.every((product) => product.isAvailableInStore === false);

            setModalData({
                type: "reorder",
                data: allProductsUnavailable ? undefined : data,
            });

            setIsModalVisible(true);
            setLoadingModalData(false);
            await globalContext.getSelectedStoreMutate();
        } else {
            setModalData({
                type: "changeStore",
                data: undefined,
            });

            const { data } = await getStoreByIdFetcher(getStoreByIdQuery, order?.storeId);

            setModalData({
                type: "changeStore",
                data: data,
            });

            setIsModalVisible(true);
            setLoadingModalData(false);
        }
    };

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
                isPageLoginProtected={true}
                locale={locale}
            >
                <CenterContentWrapper>
                    <div className="lg:flex">
                        <div className="lg:flex lg:mr-28 hidden mt-20">
                            <AccountNavigation
                                title={i18.accountNavigationTitle}
                                items={accountSidebarItems}
                                logoutCallback={async () => {
                                    await handleLogout(
                                        globalContext.setScreenBlockLoader,
                                        globalContext.useSwrGetUserDataMutate,
                                        globalContext.showNotification,
                                        globalResources.internalServerError
                                    );
                                }}
                                logoutText={i18.accountNavigationLogoutText}
                            />
                        </div>
                        <div className="block lg:hidden w-auto">
                            <ButtonList
                                title={i18.accountNavigationTitle}
                                items={accountSidebarItems}
                                logoutText={i18.accountNavigationLogoutText}
                                logoutCallback={async () => {
                                    await handleLogout(
                                        globalContext.setScreenBlockLoader,
                                        globalContext.useSwrGetUserDataMutate,
                                        globalContext.showNotification,
                                        globalResources.internalServerError
                                    );
                                }}
                            ></ButtonList>
                        </div>
                        <div className="flex-1">
                            {!isValidating && (
                                <>
                                    <Title
                                        type="h2"
                                        className="lg:flex lg:flex-initial font-bold my-3 text-xl lg:mt-24 hidden"
                                    >
                                        {i18.accountOrdersTitle}
                                    </Title>
                                    <Divider theme="light" className="w-full lg:block hidden"></Divider>
                                </>
                            )}

                            {isValidating && (
                                <div className="flex items-center justify-center h-full">
                                    <DotsLoader variant="dark" />
                                </div>
                            )}

                            {!isValidating &&
                                useSwrOrdersData?.data?.map((order, index) => {
                                    return (
                                        <OrdersAccordionItem
                                            storeNameText={i18.accountOrdersStoreNameText}
                                            storeIdText={i18.accountOrdersStoreIdText}
                                            storeName={order?.storeName}
                                            deliveryMethodText={i18.accountOrdersDeliveryMethodText}
                                            pickupAddressText={i18.accountOrdersPickupAddressText}
                                            payNowBtnText={i18.accountOrdersPayNowBtnText}
                                            taxTotal={order.taxTotal}
                                            key={index}
                                            storeId={order.storeId}
                                            defaultOpen={index === 0}
                                            orderNumberText={i18.accountOrdersNumberText}
                                            orderNumber={order?.orderNumber}
                                            dateText={i18.accountOrdersDateText}
                                            date={order?.date}
                                            statusText={i18.accountOrdersStatusText}
                                            status={order?.status}
                                            shipmentsText={i18.accountOrdersShipmentsText}
                                            billingAddressText={i18.accountOrdersBillingAddressText}
                                            billingAddress={order?.billingAddress}
                                            paymentStatusText={i18.accountOrdersPaymentStatusText}
                                            paymentStatus={order?.paymentStatus}
                                            shippingAddressText={i18.accountOrdersShippingAddressText}
                                            subTotalText={i18.accountOrdersSubTotalText}
                                            subtotal={order?.subtotal}
                                            deliveryFeeText={i18.accountOrdersDeliveryFeeText}
                                            shippingTotal={order?.shippingTotal}
                                            totalText={i18.accountOrdersTotalText}
                                            total={order?.total}
                                            shipments={order?.shipments}
                                            quantityText={i18.accountOrdersQuantityText}
                                            reorderCallback={() => handleModalData(order)}
                                            orderAgainBtnText={i18.accountOrdersOrderAgainBtnText}
                                            reorderBtnLoading={
                                                loadingModalData &&
                                                selectedOrderForReorderData?.orderNumber === order?.orderNumber
                                            }
                                        />
                                    );
                                })}
                        </div>
                        <Modal
                            actionFunction={async () => {
                                if (selectedStore && selectedStore.id === selectedOrderForReorderData?.storeId) {
                                    setIsLoading(true);
                                    const { data } = await reorderFetcher(
                                        reorderQuery,
                                        locale,
                                        selectedOrderForReorderData.orderNumber
                                    );

                                    globalContext.setBasket(data);
                                    await router.push("/cart");
                                    setIsModalVisible(false);
                                    setIsLoading(false);
                                } else {
                                    setIsLoading(true);
                                    await setSelectedStoreIdFetcher(
                                        setSelectedStoreIdMutation,
                                        selectedOrderForReorderData?.storeId,
                                        globalContext?.basket?.basketId
                                    );

                                    const { data } = await getProductsFromOrderFetcher(
                                        getProductsFromOrderQuery,
                                        locale,
                                        selectedOrderForReorderData?.orderNumber
                                    );

                                    const allProductsUnavailable = data.productItems.every(
                                        (product) => product.isAvailableInStore === false
                                    );

                                    setModalData({
                                        type: "reorder",
                                        data: allProductsUnavailable ? undefined : data,
                                    });

                                    await globalContext.getSelectedStoreMutate();
                                    setIsLoading(false);
                                }
                            }}
                            title={
                                modalData?.type === "reorder"
                                    ? i18.accountOrdersReorderModalTitle
                                    : modalData?.type === "changeStore"
                                    ? i18.accountOrdersChangeStoreModalTitle
                                    : ""
                            }
                            isLoading={isLoading}
                            actionBtnDisabled={modalData?.data === undefined}
                            text={
                                <div className="custom-height h-full">
                                    {modalData?.type === "reorder" ? (
                                        (modalData &&
                                            modalData.data?.productItems?.map((item, index) => {
                                                return (
                                                    <OrderItem
                                                        productNotAvailableText={
                                                            i18.accountOrdersProductNotAvailableText
                                                        }
                                                        size={item.size}
                                                        isAvailable={item.isAvailableInStore}
                                                        className="my-6"
                                                        key={item.productId + index}
                                                        itemId={item.productId}
                                                        productId={item.productId}
                                                        image={item.imgUrl}
                                                        productName={item.productName}
                                                        quantityText={i18.accountOrdersQuantityText}
                                                        quantity={item.quantity}
                                                        price={item.price}
                                                        ingredientsString={item.ingredientsString}
                                                    />
                                                );
                                            })) ?? <p>{i18.accountOrdersProductsNotAvailable}</p>
                                    ) : modalData?.type === "changeStore" ? (
                                        <>
                                            <p>
                                                {i18Fd &&
                                                    i18Fd.t("accountOrders:changeStoreMessage", {
                                                        storeName: modalData?.data?.name,
                                                    })}
                                            </p>
                                        </>
                                    ) : null}
                                </div>
                            }
                            yesText={
                                modalData?.type === "reorder"
                                    ? i18.accountOrdersReorderModalYesText
                                    : i18.accountOrdersChangeStoreModalSwitchText
                            }
                            noText={i18.accountOrdersReorderModalNoText}
                            isPopupVisible={isModalVisible}
                            onClose={() => {
                                setIsModalVisible(false);
                            }}
                        />
                    </div>
                </CenterContentWrapper>
            </MainLayout>
            <style jsx>
                {`
                    .custom-height {
                        max-height: 350px;
                        overflow-y: scroll;
                    }
                `}
            </style>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<AccountProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during profile edit i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                accountNavigationTitle: i18n.t("accountNavigation:title"),
                accountNavigationLogoutText: i18n.t("accountNavigation:logoutText"),
                accountNavigationProfileText: i18n.t("accountNavigation:profileText"),
                accountNavigationAddressesText: i18n.t("accountNavigation:addressesText"),
                accountNavigationOrdersText: i18n.t("accountNavigation:ordersText"),
                accountNavigationPasswordText: i18n.t("accountNavigation:passwordText"),
                accountNavigationWishlistText: i18n.t("accountNavigation:wishlistText"),
                accountOrdersTitle: i18n.t("accountOrders:title"),
                accountOrdersNumberText: i18n.t("accountOrders:orderNumberText"),
                accountOrdersDateText: i18n.t("accountOrders:dateText"),
                accountOrdersStatusText: i18n.t("accountOrders:statusText"),
                accountOrdersBillingAddressText: i18n.t("accountOrders:billingAddressText"),
                accountOrdersShippingAddressText: i18n.t("accountOrders:shippingAddressText"),
                accountOrdersShipmentsText: i18n.t("accountOrders:shipmentsText"),
                accountOrdersSubTotalText: i18n.t("accountOrders:subTotalText"),
                accountOrdersDeliveryFeeText: i18n.t("accountOrders:deliveryFeeText"),
                accountOrdersTotalText: i18n.t("accountOrders:totalText"),
                accountOrdersQuantityText: i18n.t("accountOrders:quantityText"),
                pageTitle: i18n.t("accountOrders:pageTitle"),
                accountOrdersPaymentStatusText: i18n.t("accountOrders:paymentStatusText"),
                accountOrdersPayNowBtnText: i18n.t("accountOrders:payNowBtnText"),
                accountOrdersReorderModalTitle: i18n.t("accountOrders:reorderModalTitle"),
                accountOrdersReorderModalYesText: i18n.t("accountOrders:reorderModalYesText"),
                accountOrdersReorderModalNoText: i18n.t("accountOrders:reorderModalNoText"),
                accountOrdersChangeStoreModalSwitchText: i18n.t("accountOrders:changeStoreModalSwitchText"),
                accountOrdersChangeStoreModalTitle: i18n.t("accountOrders:changeStoreModalTitle"),
                accountOrdersProductsNotAvailable: i18n.t("accountOrders:productsNotAvailable"),
                accountOrdersProductNotAvailableText: i18n.t("accountOrders:productNotAvailableText"),
                accountOrdersOrderAgainBtnText: i18n.t("accountOrders:orderAgainBtnText"),
                accountOrdersDeliveryMethodText: i18n.t("accountOrders:deliveryMethodText"),
                accountOrdersPickupAddressText: i18n.t("accountOrders:pickupAddressText"),
                accountOrdersStoreIdText: i18n.t("accountOrders:storeIdText"),
                accountOrdersStoreNameText: i18n.t("accountOrders:storeNameText"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Orders;
