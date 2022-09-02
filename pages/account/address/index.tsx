import React, { useContext } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import AccountNavigation from "components/UI/AccountNavigation";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import AccountAddressTile from "components/UI/AccountAddressTile";
import Button from "components/UI/Button";
import populateGlobalResources from "i18/populateGlobalResources";
import ButtonList from "components/UI/ButtonList";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import getAddressDataFetcher, { getAddressDataQuery } from "bdConnector/account/getSavedAddresses";
import deleteAddressFetcher, { deleteAddressMutation } from "bdConnector/account/deleteAddress";
import useSWR from "swr";
import { handleLogout } from "utils";
import updateAddressFetcher, { updateAddressMutation } from "bdConnector/account/updateAddress";
import { FetcherResponse } from "bdConnector/types";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import DotsLoader from "components/UI/DotsLoader";
import Head from "next/head";

interface AccountAddressesProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
    locale: string;
}

const AccountAddresses = ({ i18, globalResources, globalData, locale }: AccountAddressesProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const { data: useSwrAddressesData, isValidating, mutate: swrAddressesDataMutate } = useSWR(
        [getAddressDataQuery],
        getAddressDataFetcher
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
            isActive: true,
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

    const makePrimary = async (addressId: string): Promise<void> => {
        const address = useSwrAddressesData.data.find((address) => address.addressName === addressId);
        const { errorCode } = await updateAddressFetcher(updateAddressMutation, {
            ...address,
            isPrimary: true,
        });

        if (!errorCode) {
            await swrAddressesDataMutate();
        }
    };

    const deleteAddress = async (addressId: string): Promise<void> => {
        await deleteAddressFetcher(deleteAddressMutation, addressId);

        swrAddressesDataMutate(
            { data: useSwrAddressesData.data.filter((el) => el.id !== addressId), errorCode: null },
            false
        );
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
                            />
                        </div>
                        <div className="flex-1">
                            {!isValidating && (
                                <>
                                    <Title type="h2" className="lg:flex font-bold my-3 text-xl lg:mt-24 hidden">
                                        {i18.addressTitle}
                                    </Title>
                                    <Divider theme="light" className="w-full lg:block mb-3 hidden"></Divider>
                                </>
                            )}
                            {!useSwrAddressesData?.data?.length && !isValidating && (
                                <Title type="h3" alignment="left" className="flex my-3">
                                    {i18.youHaveNoAddressYet}
                                </Title>
                            )}
                            {!isValidating ? (
                                useSwrAddressesData?.data?.map((address) => {
                                    return (
                                        <AccountAddressTile
                                            key={address.id}
                                            id={address.id}
                                            firstName={address.firstName}
                                            lastName={address.lastName}
                                            address1={address.address1}
                                            address2={address.address2}
                                            country={address.country}
                                            city={address.city}
                                            state={address.state}
                                            zip={address.zip}
                                            phone={address.phone}
                                            addressName={address.addressName}
                                            makePrimaryBtnText={i18.addressMakePrimary}
                                            editBtnLink={`/account/address/edit/${address.id}`}
                                            editBtnText={i18.addressEditButton}
                                            isPrimary={address.isPrimary}
                                            makePrimaryBtnFunction={makePrimary}
                                            deletePopupProps={{
                                                title: i18.modalTitle,
                                                text: i18.modalComponentText,
                                                yesText: i18.modalDeleteBtn,
                                                noText: i18.modalDiscardBtn,
                                                actionFunction: () => deleteAddress(address.id),
                                                isPopupVisible: true,
                                            }}
                                        />
                                    );
                                })
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <DotsLoader variant="dark" />
                                </div>
                            )}

                            {!isValidating && (
                                <>
                                    <Divider theme="light" className="w-full"></Divider>
                                    <Button variant="primary" className="my-3" link="/account/address/add">
                                        {i18.addressAddButton}
                                    </Button>
                                </>
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
}: GetStaticPropsContext): Promise<GetStaticPropsResult<AccountAddressesProps>> => {
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
                addressTitle: i18n.t("address:title"),
                addressEditButton: i18n.t("address:editButton"),
                addressPrimary: i18n.t("address:primaryAddress"),
                addressSecondary: i18n.t("address:secondaryAddress"),
                addressMakePrimary: i18n.t("address:primaryButton"),
                addressAddButton: i18n.t("address:addAddress"),
                modalTitle: i18n.t("address:modalTitle"),
                modalComponentText: i18n.t("address:componentText"),
                modalDeleteBtn: i18n.t("address:deleteBtn"),
                modalDiscardBtn: i18n.t("address:discardBtn"),
                youHaveNoAddressYet: i18n.t("address:youHaveNoAddressYet"),
                pageTitle: i18n.t("address:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default AccountAddresses;
