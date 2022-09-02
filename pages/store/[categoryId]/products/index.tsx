import React, { useContext, useState, useEffect, useMemo } from "react";
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPaths } from "next";
import i18nInit from "i18";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import populateGlobalResources from "i18/populateGlobalResources";
import Filters, { AppliedFilter, Filter } from "components/plp/Filters";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import HeaderBanner from "components/UI/HeaderBanner";
import ProductTile from "components/plp/productTile";
import MainLayout from "components/layouts/main";
import { GlobalContext } from "context/global";
import { useRouter } from "next/router";
import getPlpDataFetcher, { getPlpDataQuery } from "bdConnector/category/getPlpData";
import getIsrPreRenderedPlpsFetcher, {
    getIsrPreRenderedPlpsQuery,
} from "bdConnector/category/getIsrPreRenderedPlpsFetcher";
import useSWR from "swr";
import Pagination from "components/plp/Pagination";
import { FetcherResponse } from "bdConnector/types";
import revalidatePagesConfig from "../../../../config/revalidatePagesConfig.json";
import Modal from "components/UI/ModalPopup";
import Head from "next/head";
import TilesCarousel from "components/UI/TilesCarousel";
interface PlpProduct {
    name: string;
    description: string;
    price: string;
    weight?: string;
    id: string;
    imgUrl: string;
    isAvailableInStore: boolean;
}
export interface PlpData {
    name: string;
    imgMobileUrl: string;
    imgDesktopUrl: string;
    resultsQty: number;
    filters: Filter[];
    productsList: PlpProduct[];
    subCategories: [];
    isStoreSelected: boolean;
}
interface PLPProps {
    i18: Record<string, string>;
    locale: string;
    categoryId: string;
    globalData: FetcherResponse<GlobalData>;
    plpData: { data: PlpData; errorCode?: string };
    globalResources: Record<string, string>;
}

const initialNumberOfProductsPerTab = 12;

const PLP = ({ globalResources, globalData, i18, categoryId, plpData, locale }: PLPProps): JSX.Element => {
    const router = useRouter();
    const [numberOfProductsPerTab] = useState(initialNumberOfProductsPerTab);
    const [paginationOffset, setPaginationOffset] = useState("0");
    const [isPlpFiltersExpanded, setPlpFiltersExpanded] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState([]);
    const [currentActivePaginationItemIndex, setCurrentActivePaginationItemIndex] = useState(0);
    const globalContext = useContext(GlobalContext);
    const [modal, setModal] = useState<{ isVisible: boolean; message?: string; title?: string }>({
        isVisible: false,
        message: "",
        title: "",
    });

    const getAppliedFiltersFromRouter = (routerQuery, currentPlpData): AppliedFilter[] => {
        const filterKeys = currentPlpData?.filters?.map((filter) => {
            return filter?.id;
        });
        let appliedFiltersResponse: AppliedFilter[] = [];

        if (filterKeys && filterKeys.length) {
            const filterUriKeys = Object.keys(routerQuery).filter((key) => {
                return filterKeys.includes(key);
            });

            appliedFiltersResponse = filterUriKeys?.map((key) => {
                const uriDecodedKey = decodeURIComponent(key);

                if (typeof routerQuery[key] == "string") {
                    const uriDecodedValue = decodeURIComponent(routerQuery[key]);
                    return {
                        id: uriDecodedKey,
                        values: [uriDecodedValue],
                    };
                }
                if (typeof routerQuery[key] == "object") {
                    // if its an array
                    const uriDecodedValues = routerQuery[key].map((value) => {
                        return decodeURIComponent(value);
                    });

                    return {
                        id: uriDecodedKey,
                        values: uriDecodedValues,
                    };
                }
            });

            return appliedFiltersResponse;
        } else {
            return [];
        }
    };
    const memoizedAppliedFiltersFromRouter = useMemo(() => getAppliedFiltersFromRouter(router.query, plpData.data), [
        router.query,
        plpData.data,
    ]);
    const memoizedQueryOffsetInt = useMemo(() => parseInt(router.query.offset as string), [router.query.offset]);
    const { data: swrPlpData, isValidating } = useSWR(
        [
            router.isReady ? getPlpDataQuery : null, // don't fetch till router is ready
            categoryId,
            locale,
            memoizedQueryOffsetInt,
            numberOfProductsPerTab,
            memoizedAppliedFiltersFromRouter,
        ],
        getPlpDataFetcher,
        {
            fallbackData: plpData,
            onSuccess: ({ data }) => {
                if (!data.isStoreSelected) {
                    setModal({
                        isVisible: true,
                        message: i18.noStoreSelected,
                        title: i18.noStoreSelectedTitle,
                    });
                }
            },
        }
    );

    useEffect(() => {
        setCurrentActivePaginationItemIndex(Math.floor(parseInt(paginationOffset) / numberOfProductsPerTab));
    }, [paginationOffset, numberOfProductsPerTab]);

    const toggleFilter = (filterIdToToggle: string, filterValueToToggle: string): void => {
        let isFilterToToggleIdInAppliedFilters = false;
        let isFilterToToggleIdAndValueInAppliedFilters = false;
        const filterIdToToggleType = swrPlpData?.data?.filters?.filter((currentFilter) => {
            return currentFilter.id === filterIdToToggle;
        })[0].type;

        appliedFilters.forEach((appliedFilter) => {
            if (appliedFilter.id === filterIdToToggle) {
                isFilterToToggleIdInAppliedFilters = true;
                if (appliedFilter.values.includes(filterValueToToggle)) {
                    isFilterToToggleIdAndValueInAppliedFilters = true;
                }
            }
        });

        const appliedFiltersColone = JSON.parse(JSON.stringify(appliedFilters)); //deep clone of applied filters

        if (filterIdToToggleType === "boolean" || filterIdToToggleType === "checkboxGroup") {
            if (isFilterToToggleIdAndValueInAppliedFilters) {
                appliedFiltersColone.forEach((appliedFilter) => {
                    if (filterIdToToggle === appliedFilter.id) {
                        const indexOfItemToRemove = appliedFilter.values?.indexOf(filterValueToToggle);

                        if (indexOfItemToRemove != -1) {
                            appliedFilter.values.splice(indexOfItemToRemove, 1);
                        }
                    }
                });
            } else {
                let isFilterIdToToggleFound = false;

                appliedFiltersColone.forEach((appliedFilter) => {
                    if (appliedFilter.id === filterIdToToggle) {
                        appliedFilter.values.push(filterValueToToggle);
                        isFilterIdToToggleFound = true;
                    }
                });

                if (!isFilterIdToToggleFound) {
                    appliedFiltersColone.push({
                        id: filterIdToToggle,
                        values: [filterValueToToggle],
                    });
                }
            }
        } else if (filterIdToToggleType === "radioGroup") {
            if (isFilterToToggleIdInAppliedFilters) {
                appliedFiltersColone.forEach((appliedFilter) => {
                    // Make toggleable radio buttons
                    if (isFilterToToggleIdAndValueInAppliedFilters) {
                        if (filterIdToToggle === appliedFilter.id) {
                            const indexOfItemToRemove = appliedFilter.values?.indexOf(filterValueToToggle);

                            if (indexOfItemToRemove != -1) {
                                appliedFilter.values.splice(indexOfItemToRemove, 1);
                            }
                        }
                    } else {
                        if (filterIdToToggle === appliedFilter.id) {
                            appliedFilter.values = [filterValueToToggle];
                        }
                    }
                });
            } else {
                appliedFiltersColone.push({
                    id: filterIdToToggle,
                    values: [filterValueToToggle],
                });
            }
        }

        setAppliedFilters(appliedFiltersColone);
        setPaginationOffset("0");
    };

    const resetFilters = (): void => {
        setPaginationOffset("0");
        setAppliedFilters([]);
    };

    const makeAppliedFiltersUriReady = (appliedFilters): string => {
        let uriReadyString = "";
        appliedFilters?.forEach((appliedFilter) => {
            appliedFilter?.values?.forEach((appliedFilterValue) => {
                uriReadyString += `${appliedFilter?.id}=${encodeURIComponent(appliedFilterValue)}&`;
            });
        });
        if (uriReadyString.length) {
            uriReadyString = uriReadyString.substring(0, uriReadyString.length - 1);
        }
        return uriReadyString;
    };

    useEffect(() => {
        if (!router.isReady) return;

        const appliedFiltersFromRouter = getAppliedFiltersFromRouter(router.query, swrPlpData.data);

        setAppliedFilters(appliedFiltersFromRouter);
        setPaginationOffset(router.query?.offset as string);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, router.query?.offset]);

    useEffect(() => {
        const uriReadyFilters = makeAppliedFiltersUriReady(appliedFilters);

        const newRoute = `/store/${categoryId}/products?offset=${paginationOffset || "0"}${
            uriReadyFilters && "&" + uriReadyFilters
        }`;

        if (router.isReady && router.asPath !== newRoute) {
            router.push(newRoute);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedFilters, paginationOffset]);

    return (
        <>
            <Head>
                <title>{swrPlpData?.data?.name}</title>
                <meta property="og:title" content={swrPlpData?.data?.name} key="title" />
            </Head>
            <MainLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                locale={locale}
            >
                <HeaderBanner
                    imgMobileUrl={swrPlpData?.data?.imgMobileUrl || "/images/no-image-icon.png"}
                    imgDesktopUrl={swrPlpData?.data?.imgDesktopUrl || "/images/no-image-icon.png"}
                    title={swrPlpData?.data?.name}
                    subTitle={`${swrPlpData?.data?.resultsQty} ${i18.products}`}
                >
                    <Filters
                        filterByText="Filter by:"
                        resetText="Reset filter"
                        titleText="Filter"
                        appliedFilters={appliedFilters}
                        toggleFilterCallback={(filterKey, filterValue) => {
                            toggleFilter(filterKey, filterValue);
                        }}
                        isFiltersExpanded={isPlpFiltersExpanded}
                        setFiltersExpandedCallback={(isFilterExpanded) => {
                            setPlpFiltersExpanded(isFilterExpanded);
                        }}
                        resetFiltersCallback={() => {
                            resetFilters(); //refactor
                        }}
                        filters={swrPlpData?.data?.filters}
                    />
                </HeaderBanner>

                <CenterContentWrapper>
                    <section className="mt-4 lg:mt-8 mb-11 grid grid-cols-2 lg:grid-cols-4 gap-x-4 lg:gap-x-8 gap-y-8">
                        {swrPlpData?.data?.productsList?.map((productData) => {
                            return (
                                <ProductTile
                                    isLoadingTile={isValidating}
                                    key={productData.id}
                                    {...productData}
                                    isAvailableInStoreText={i18.productUnavailable}
                                />
                            );
                        })}
                    </section>
                    <Pagination
                        itemsPerPaginationStep={numberOfProductsPerTab}
                        paginationItemClickCallback={(paginationIndex) => {
                            setPaginationOffset((parseInt(paginationIndex) * numberOfProductsPerTab).toString());
                        }}
                        showNextPaginationGroupText={"Show Next Pagination Group"}
                        showPreviousPaginationGroupText={"Show Previous Pagination Group"}
                        currentActivePaginationItemIndex={currentActivePaginationItemIndex}
                        maxPaginationItemsToShowPerStep={5}
                        totalSearchResults={swrPlpData?.data?.resultsQty}
                    />
                    <TilesCarousel
                        slidesPerViewXs={3}
                        slidesPerViewS={3.3}
                        slidesPerViewMd={6.3}
                        slidesPerViewLg={8}
                        spaceBetween={28.5}
                        title={i18.categoriesCarouselTitleText}
                        tiles={[
                            ...(plpData?.data?.subCategories
                                ? plpData?.data?.subCategories.map((el: any) => {
                                      return {
                                          id: el.id,
                                          name: el.name,
                                          img: el.categoryLogo,
                                      };
                                  })
                                : []),
                        ]}
                    />
                </CenterContentWrapper>
                <Modal
                    forceUserAction={true}
                    text={modal?.message}
                    actionFunction={() => {
                        router.push("/storelocator");
                    }}
                    onClose={() => setModal({ ...modal, isVisible: false })}
                    isPopupVisible={modal?.isVisible}
                    title={modal?.title}
                    yesText={i18.modalYesText}
                />
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
    params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<PLPProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during category page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    const plpData: { data: PlpData; errorCode?: string } = await getPlpDataFetcher(
        getPlpDataQuery,
        params.categoryId as string,
        locale,
        0,
        initialNumberOfProductsPerTab,
        []
    );

    return {
        props: {
            locale,
            plpData,
            categoryId: params.categoryId as string,
            globalData: globalData,
            i18: {
                categoriesCarouselTitleText: i18n.t("plp:categoriesCarouselTitleText"),
                products: i18n.t("plp:products"),
                back: i18n.t("plp:back"),
                noStoreSelected: i18n.t("plp:noStoreSelected"),
                noStoreSelectedTitle: i18n.t("plp:noStoreSelectedTitle"),
                modalYesText: i18n.t("plp:modalYesText"),
                productUnavailable: i18n.t("plp:productUnavailable"),
            },
            globalResources: populateGlobalResources(i18n),
        },
        revalidate: revalidatePagesConfig.plp,
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const categories = await getIsrPreRenderedPlpsFetcher(getIsrPreRenderedPlpsQuery);

    if (categories.errorCode) {
        throw new Error("Error while trying to fetch PLPs to prerender with ISR: " + categories.errorCode);
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

export default PLP;
