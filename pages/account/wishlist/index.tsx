import React, { useContext, useMemo, useState } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import populateGlobalResources from "i18/populateGlobalResources";
import ButtonList from "components/UI/ButtonList";
import OrderItem from "components/UI/OrderItem";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import useSWR from "swr";
import { getCustomerWishlistQuery } from "bdConnector/account/getCustomerWishlist";
import deleteWishlistItemFetcher, { deleteWishlistItemMutation } from "bdConnector/account/deleteWishlistItem";
import { handleLogout } from "utils";
import { FetcherResponse } from "bdConnector/types";
import getCustomerWishlistFetcher from "bdConnector/account/getCustomerWishlist";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import DotsLoader from "components/UI/DotsLoader";
import Button from "components/UI/Button";
import updateWishlistFetcher, { updateWishlistMutation } from "bdConnector/account/updateCustomerWishlist";
import Modal from "components/UI/ModalPopup";
import { useRouter } from "next/router";
import Head from "next/head";

interface AccountProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
}

const Account = ({ i18, globalResources, globalData, locale }: AccountProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const { data: useSwrWishlistData, mutate: swrWishlistDataMutate, isValidating } = useSWR(
        [getCustomerWishlistQuery, locale],
        getCustomerWishlistFetcher
    );

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
            isActive: false,
        },
        {
            title: i18.accountNavigationPasswordText,
            link: "/account/password",
            isActive: false,
        },
        {
            title: i18.accountNavigationWishlistText,
            link: "/account/wishlist",
            isActive: true,
        },
    ];

    const productsList =
        (useSwrWishlistData &&
            useSwrWishlistData?.data?.perStoreProductListItems?.map((group) => {
                return (
                    <div key={group.id}>
                        <h1 className="text-lg font-bold font-primary my-4">{group.name}</h1>
                        {group.items.map((tile) => {
                            return (
                                <div key={tile.id} className="grid grid-cols-2 gap-3">
                                    <OrderItem
                                        itemId={tile.id}
                                        productId={tile.productId}
                                        image={tile.image}
                                        productName={tile.name}
                                        size={tile.size}
                                        quantityText={i18.accountOrdersQuantityText}
                                        quantity={tile.quantity}
                                        price={tile.price}
                                        storeId={tile.storeId}
                                        btnText={i18.wishlistPortalBtnRemove}
                                        btnClickCallbackFunction={async (id) => {
                                            const { errorCode } = await deleteWishlistItemFetcher(
                                                deleteWishlistItemMutation,
                                                id,
                                                useSwrWishlistData.data.wishlistId
                                            );

                                            if (errorCode) {
                                                return globalContext.showNotification({
                                                    type: "error",
                                                    message: globalResources.internalServerError,
                                                    autoClose: true,
                                                });
                                            }

                                            swrWishlistDataMutate();
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            })) ??
        null;

    const wishlistPublicUrl = useMemo(() => {
        if (router.isReady && !isValidating && useSwrWishlistData?.data !== null) {
            return `${window.location.protocol}//${window.location.host}/wishlist/${useSwrWishlistData?.data?.wishlistId}`;
        }
    }, [isValidating, router.isReady, useSwrWishlistData]);

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
                        <div className="lg:flex lg:mr-28 mt-20 hidden">
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
                            />
                        </div>

                        {isValidating ? (
                            <div className="flex items-center justify-center w-full">
                                <DotsLoader variant="dark" />
                            </div>
                        ) : !isValidating && productsList?.length ? (
                            <div className="flex-1 lg:mt-20">
                                <div className="flex justify-between">
                                    <Title type="h2" alignment="left" className="font-bold hidden lg:block">
                                        {i18.wishlistPortalTitle}
                                    </Title>
                                    <Button
                                        onClick={async () => {
                                            const isPublicWishlist = useSwrWishlistData.data.public;

                                            const { errorCode } = await updateWishlistFetcher(
                                                updateWishlistMutation,
                                                useSwrWishlistData.data.wishlistId,
                                                isPublicWishlist ? false : true,
                                                locale
                                            );

                                            if (!isPublicWishlist && !errorCode) {
                                                await swrWishlistDataMutate();
                                                setIsModalOpen(true);
                                            } else if (errorCode) {
                                                globalContext.showNotification({
                                                    type: "error",
                                                    message: globalResources.internalServerError,
                                                    autoClose: true,
                                                });
                                            }

                                            swrWishlistDataMutate();
                                        }}
                                        customTextColorClass="text-t-primary"
                                        type="button"
                                        variant="text-link"
                                    >
                                        {useSwrWishlistData.data.public
                                            ? i18.wishlistPortalMakePrivate
                                            : i18.wishlistPortalMakePublic}
                                    </Button>
                                </div>
                                <Divider theme="light" className="lg:block hidden"></Divider>
                                <div className="mt-2">{productsList}</div>
                            </div>
                        ) : (
                            <div className="flex-1 lg:mt-20">
                                <div className="flex justify-between flex-col">
                                    <Title type="h2" alignment="left" className="font-bold text-xl hidden lg:block">
                                        {i18.wishlistPortalTitle}
                                    </Title>
                                    <Divider theme="light" className="lg:block w-full hidden" />
                                    <p className="font-primary text-lg mt-2">{i18.wishlistPortalNoProducts}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <Modal
                        isPopupVisible={isModalOpen}
                        title={i18.wishlistPortalModalTitle}
                        text={
                            <>
                                <div>
                                    <p className="font-primary text-sm">{i18.wishlistPortalModalText}</p>
                                    <div className="w-full text-sm p-2 border border-bgr-tertiary-faded h-11">
                                        {wishlistPublicUrl}
                                    </div>
                                </div>
                            </>
                        }
                        actionFunction={() => {
                            setIsModalOpen(false);
                        }}
                        noText={i18.wishlistPortalCopyLink}
                        yesText={i18.wishlistPortalClose}
                        onClose={() => {
                            navigator.clipboard.writeText(wishlistPublicUrl);
                            setIsModalOpen(false);
                            globalContext.showNotification({
                                type: "success",
                                message: i18.wishlistPortalCopyLinkSuccess,
                                autoClose: true,
                            });
                        }}
                    ></Modal>
                </CenterContentWrapper>
            </MainLayout>
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
        console.log("Error during profile i18n initialization:", e);
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
                wishlistPortalTitle: i18n.t("wishlistPortal:title"),
                wishlistPortalMakePublic: i18n.t("wishlistPortal:makePublic"),
                wishlistPortalMakePrivate: i18n.t("wishlistPortal:makePrivate"),
                wishlistPortalNoProducts: i18n.t("wishlistPortal:noProducts"),
                wishlistPortalCopyLink: i18n.t("wishlistPortal:copyLink"),
                wishlistPortalClose: i18n.t("wishlistPortal:close"),
                wishlistPortalCopyLinkSuccess: i18n.t("wishlistPortal:copyLinkSuccess"),
                wishlistPortalModalTitle: i18n.t("wishlistPortal:modalTitle"),
                wishlistPortalModalText: i18n.t("wishlistPortal:modalText"),
                wishlistPortalBtnRemove: i18n.t("wishlistPortal:btnRemove"),
                accountOrdersQuantityText: i18n.t("accountOrders:quantityText"),
                pageTitle: i18n.t("wishlistPortal:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Account;
