import React, { useContext, useState, useEffect } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import AccountProfileTile from "components/UI/AccountProfileTile";
import populateGlobalResources from "i18/populateGlobalResources";
import ButtonList from "components/UI/ButtonList";
import getProfileDataFetcher, { getProfileDataQuery } from "bdConnector/account/getProfileData";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import useSWR from "swr";
import { handleLogout } from "utils";
import { FetcherResponse } from "bdConnector/types";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import DotsLoader from "components/UI/DotsLoader";
import Head from "next/head";

export interface UserProfileInterface {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    numberOfOrders?: number;
    lastOrderDate?: string;
}

interface AccountProfileProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
}

const Account = ({ i18, globalResources, globalData, locale }: AccountProfileProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const [accountProfileUseSwrItemsArray, setAccountProfileUseSwrItemsArray] = useState([]);

    const { data: useSwrProfileData, isValidating } = useSWR([getProfileDataQuery, locale], getProfileDataFetcher);

    const accountSidebarItems = [
        {
            title: i18.accountNavigationProfileText,
            link: "/account/profile",
            isActive: true,
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
    ];

    if (globalData.data.sitePreferences.isWishlistEnabled) {
        accountSidebarItems.push({
            title: i18.accountNavigationWishlistText,
            link: "/account/wishlist",
            isActive: false,
        });
    }

    const accountProfileInitialItemsArray = [
        {
            name: i18.profilePortalName,
            value: useSwrProfileData?.data?.firstName + " " + useSwrProfileData?.data?.lastName,
            showTopMargin: true,
        },
        {
            name: i18.profilePortalEmail,
            value: useSwrProfileData?.data?.email,
            showTopMargin: true,
        },
        {
            name: i18.profilePortalPhone,
            value: useSwrProfileData?.data?.phone,
            showTopMargin: true,
        },
        {
            name: i18.profilePortalOrders,
            value: useSwrProfileData?.data?.numberOfOrders?.toString(),
            showTopMargin: true,
        },
        {
            name: i18.profilePortalLastOrder,
            value: useSwrProfileData?.data?.lastOrderDate,
            showTopMargin: true,
        },
    ];

    useEffect(() => {
        setAccountProfileUseSwrItemsArray([
            {
                name: i18.profilePortalName,
                value: useSwrProfileData?.data?.firstName + " " + useSwrProfileData?.data?.lastName,
                showTopMargin: true,
            },
            {
                name: i18.profilePortalEmail,
                value: useSwrProfileData?.data?.email,
                showTopMargin: true,
            },
            {
                name: i18.profilePortalPhone,
                value: useSwrProfileData?.data?.phone,
                showTopMargin: true,
            },
            {
                name: i18.profilePortalOrders,
                value: useSwrProfileData?.data?.numberOfOrders?.toString(),
                showTopMargin: true,
            },
            {
                name: i18.profilePortalLastOrder,
                value: useSwrProfileData?.data?.lastOrderDate,
                showTopMargin: true,
            },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useSwrProfileData]);

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
                        <div className="lg:flex lg:mr-28 mt-20 justify-between hidden">
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
                        <div className="flex-1">
                            {!isValidating ? (
                                <>
                                    <Title
                                        type="h2"
                                        className="lg:flex lg:flex-initial font-bold lg:my-3 text-xl lg:mt-24 hidden"
                                    >
                                        {i18.profilePortalTitle}
                                    </Title>
                                    <Divider theme="light" className="w-full lg:block hidden"></Divider>
                                    <AccountProfileTile
                                        items={accountProfileUseSwrItemsArray || accountProfileInitialItemsArray}
                                        editText={i18.profilePortalEditButtonText}
                                        editLink={"profile/edit"}
                                    />
                                </>
                            ) : (
                                <div className="flex items-center justify-center lg:h-full">
                                    <DotsLoader variant="dark" />
                                </div>
                            )}
                        </div>
                    </div>
                </CenterContentWrapper>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<AccountProfileProps>> => {
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
                profilePortalTitle: i18n.t("profilePortal:title"),
                profilePortalName: i18n.t("profilePortal:name"),
                profilePortalEmail: i18n.t("profilePortal:email"),
                profilePortalPhone: i18n.t("profilePortal:phone"),
                profilePortalOrders: i18n.t("profilePortal:orders"),
                profilePortalLastOrder: i18n.t("profilePortal:lastOrder"),
                profilePortalEditButtonText: i18n.t("profilePortal:editButtonText"),
                pageTitle: i18n.t("profilePortal:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Account;
