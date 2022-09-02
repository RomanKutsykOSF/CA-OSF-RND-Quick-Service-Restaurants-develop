import Head from "next/head";
import React, { useContext } from "react";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "context/global";
import i18nInit from "i18";
import MainLayout from "components/layouts/main";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import StoreSearch from "components/UI/StoreSearch";
import { FetcherResponse } from "bdConnector/types";
import DynamicComponent from "components/Utils/DynamicComponent";
import getCMSContentByIdFetcher, { getCMSContentByIdQuery } from "bdConnector/cms/getCMSContentById";

interface HomeProps {
    i18: Record<string, string>;
    locales: string[];
    locale: string;
    globalData: FetcherResponse<GlobalData>;
    homepageContent: any;
    globalResources: Record<string, string>;
}

const Home = ({ i18, locale, globalData, homepageContent, globalResources }: HomeProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <>
            <Head>
                <title>{i18.pageTitle}</title>
                <meta property="og:title" content={i18.pageTitle} key="title" />
            </Head>
            <MainLayout
                globalResources={globalResources}
                i18={i18}
                disableFooterTopMargin={true}
                themeVariables={globalContext.themeCssString}
                locale={locale}
                globalData={globalData}
            >
                <main>
                    <StoreSearch
                        globalResources={globalResources}
                        inputPlaceholder={i18.searchInputPlaceholder}
                        viewAllUrl="/storelocator"
                        viewAllLabel={i18.viewAllStores}
                        useCurrentLocationLabel={i18.useCurrentLocation}
                        title={i18.homeSearchTitle}
                        subTitle={i18.homeSearchSubtitle}
                        collectionBtnLabel={i18.collectionLabel}
                        deliveryBtnLabel={i18.deliveryLabel}
                        bannerImgDesktopWidth={1440}
                        locale={locale}
                        bannerImgDesktopHeight={473}
                        bannerImgDesktopUrl="/images/banner.png"
                        bannerImgMobileUrl="/images/homeBannerMobile.png"
                        bannerImgMobileHeight={389}
                        bannerImgMobileWidth={375}
                        addressDeliveryMethodId={globalData.data.storelocatorConfigs.addressDeliveryMethodId}
                        pickUpInStoreMethodId={globalData.data.storelocatorConfigs.pickUpInStoreMethodId}
                        defaultStoreSearchRadius={globalData.data.storelocatorConfigs.defaultStoreSearchRadius}
                    />

                    {homepageContent?.data?.map((componentData, index) => {
                        return <DynamicComponent key={index} componentData={componentData} />;
                    })}
                </main>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
    locales,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<HomeProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during home page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    let homepageContent;

    try {
        homepageContent = await getCMSContentByIdFetcher(getCMSContentByIdQuery, "pageDesigner", "homepage", locale);
    } catch (err) {
        console.log("Could not fetch page content:", err);
    }

    return {
        props: {
            globalResources: populateGlobalResources(i18n),
            homepageContent,
            locales,
            locale,
            globalData,
            i18: {
                collectionBtnLabel: i18n.t("storelocator:chooseStore"),
                searchInputPlaceholder: i18n.t("storelocator:searchInputPlaceholder"),
                useCurrentLocation: i18n.t("homepage:useCurrentLocation"),
                viewAllStores: i18n.t("homepage:viewAllStores"),
                unitedStates: i18n.t("homepage:unitedStates"),
                unitedKingdom: i18n.t("homepage:unitedKingdom"),
                germany: i18n.t("homepage:germany"),
                france: i18n.t("homepage:france"),
                spain: i18n.t("homepage:spain"),
                deliveryLabel: i18n.t("homepage:deliveryLabel"),
                collectionLabel: i18n.t("homepage:collectionLabel"),
                homeSearchTitle: i18n.t("homepage:homeSearchTitle"),
                homeSearchSubtitle: i18n.t("homepage:homeSearchSubtitle"),
                pageTitle: i18n.t("homepage:pageTitle"),
            },
        },
    };
};

export default Home;
