import React, { useContext, useEffect } from "react";
import MainLayout from "components/layouts/main";
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPaths } from "next";
import i18nInit from "i18";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import { GlobalContext } from "context/global";
import { GlobalData } from "interfaces/globalContext";
import populateGlobalResources from "i18/populateGlobalResources";
import getCLPDataFetcher, { getCLPDataQuery } from "bdConnector/category/getClpData";
import getIsrPreRenderedClpsFetcher, {
    getIsrPreRenderedClpsFetcherQuery,
} from "bdConnector/category/getIsrPreRenderedClpsFetcher";
import { FetcherResponse } from "bdConnector/types";
import TilesCarousel from "components/UI/TilesCarousel";
import ProductRecommendations from "components/UI/ProductRecommendations";
import AdvertisementBanner from "components/UI/AdvertisementBanner";
import { StoreLocatorContext } from "context/storelocator";
import revalidatePagesConfig from "../../../config/revalidatePagesConfig.json";
import useSWR from "swr";
import { useRouter } from "next/router";
import Head from "next/head";
import useStoreQuery from "hooks/useStoreQuery";
import Modal from "components/UI/ModalPopup";
export interface ClpData {
    isClpEnabled: boolean;
    subCategories: [];
    popularProducts: [];
    imgMobile: string;
    imgDesktop: string;
}

interface CLPProps {
    i18: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
    clpData: {
        data: ClpData;
        errorCode?: string;
    };
    globalResources: Record<string, string>;
}

const CLP = ({ globalResources, globalData, clpData, locale, i18 }: CLPProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const { selectedStore } = useContext(StoreLocatorContext);
    const [i18Fd, setI18Fd] = React.useState(null);
    const { query } = useRouter();

    useEffect(() => {
        i18nInit(locale)
            .then((i18Fd) => {
                setI18Fd(i18Fd);
            })
            .catch((e) => {
                console.log("Error during clp i18Fd initialization:", e);
            });

        globalContext.getSelectedStoreMutate && globalContext.getSelectedStoreMutate();
    }, [globalContext, locale]);

    const { data: swrClpData, isValidating, mutate: clpSwrMutatorFn } = useSWR(
        [getCLPDataQuery, query.categoryId, locale],
        getCLPDataFetcher,
        {
            fallbackData: clpData,
        }
    );

    const { handleModalCancel, handleModalConfirm, modalOpen, storeDataFromQuery } = useStoreQuery({
        mutateFn: [clpSwrMutatorFn],
        routerPath: `/store/${selectedStore?.id}`,
        basket: globalContext?.basket,
        getSelectedStoreMutate: globalContext?.getSelectedStoreMutate,
    });

    return (
        <>
            <Head>
                <title>{selectedStore?.name ?? i18.bannerSubTitle}</title>
                <meta property="og:title" content={selectedStore?.name ?? i18.bannerSubTitle} key="title" />
            </Head>
            <MainLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                locale={locale}
            >
                <CenterContentWrapper>
                    {swrClpData?.data?.isClpEnabled ? (
                        <>
                            <TilesCarousel
                                slidesPerViewXs={3}
                                slidesPerViewS={3.3}
                                slidesPerViewMd={6.3}
                                slidesPerViewLg={8}
                                spaceBetween={28.5}
                                title={i18.categoriesCarouselTitleText}
                                tiles={[
                                    ...swrClpData.data.subCategories.map((el: any) => {
                                        return {
                                            id: el.id,
                                            name: el.name,
                                            img: el.categoryLogo,
                                        };
                                    }),
                                ]}
                            />

                            {selectedStore && (
                                <AdvertisementBanner
                                    title={selectedStore.name}
                                    subTitle={i18.bannerSubTitle}
                                    link={`/store/${selectedStore.id}/products`}
                                    btnText={i18.bannerBtnText}
                                    imgDesktop={swrClpData.data.imgDesktop}
                                    imgMobile={swrClpData.data.imgMobile}
                                />
                            )}

                            <ProductRecommendations
                                slidesPerViewXs={2}
                                slidesPerViewS={2}
                                slidesPerViewMd={3}
                                slidesPerViewLg={4}
                                spaceBetween={20}
                                productUnavailableText={i18.productUnavailableText}
                                title="Popular Products"
                                isLoading={isValidating}
                                tiles={[
                                    ...swrClpData.data.popularProducts.map((el: any) => {
                                        return {
                                            name: el.name,
                                            price: el.price,
                                            weight: el.weight,
                                            id: el.id,
                                            imgUrl: el.imgUrl,
                                            description: el.description,
                                            isAvailableInStore: el.isAvailableInStore,
                                        };
                                    }),
                                ]}
                            />

                            <Modal
                                actionFunction={() => handleModalConfirm()}
                                title={globalResources.changeStoreConfirmTitle}
                                text={
                                    <>
                                        <p className="text-sm text-t-secondary mt-2">
                                            {i18Fd
                                                ? i18Fd.t("clp:changeStoreMessage1", {
                                                      selectedStoreName: selectedStore?.name,
                                                      storeFromQueryName: storeDataFromQuery?.name,
                                                  })
                                                : ""}
                                        </p>
                                        <p className="text-sm text-t-secondary mt-2">
                                            {i18Fd
                                                ? i18Fd.t("clp:changeStoreMessage2", {
                                                      storeFromQueryName: storeDataFromQuery?.name,
                                                  })
                                                : ""}
                                        </p>
                                        <p className="text-xs text-t-secondary mt-2 font-bold">
                                            {i18.changeStoreCartNotice}
                                        </p>
                                    </>
                                }
                                isPopupVisible={modalOpen}
                                yesText={globalResources.changeStoreYes}
                                noText={globalResources.changeStoreNo}
                                onClose={() => handleModalCancel()}
                            />
                        </>
                    ) : (
                        <p>This Category does not have CLP configured</p>
                    )}
                </CenterContentWrapper>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
    params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<CLPProps>> => {
    let i18n: any;
    const categoryId = params.categoryId;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during category page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    let clpData;

    try {
        clpData = await getCLPDataFetcher(getCLPDataQuery, categoryId.toString(), locale);
    } catch (err) {
        console.log("Could not fetch CLP data", err);
    }

    return {
        props: {
            locale,
            clpData,
            globalData,
            i18: {
                categoriesCarouselTitleText: i18n.t("clp:categoriesCarouselTitleText"),
                bannerBtnText: i18n.t("clp:bannerBtnText"),
                bannerSubTitle: i18n.t("clp:bannerSubTitleText"),
                productUnavailableText: i18n.t("clp:productUnavailableText"),
                changeStoreCartNotice: i18n.t("clp:changeStoreNotice"),
            },
            globalResources: populateGlobalResources(i18n),
        },
        revalidate: revalidatePagesConfig.clp,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await getIsrPreRenderedClpsFetcher(getIsrPreRenderedClpsFetcherQuery);

    if (categories.errorCode) {
        throw new Error("Error while trying to fetch CLPs to prerender with ISR: " + categories.errorCode);
    }

    // Get the paths we want to pre-render based on categories
    const paths = categories?.data.map((categoryId) => ({
        params: { categoryId },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: "blocking" };
};

export default CLP;
