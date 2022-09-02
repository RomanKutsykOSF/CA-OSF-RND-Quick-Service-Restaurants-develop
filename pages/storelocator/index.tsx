import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { useContext, useEffect, useRef, useState } from "react";

import MainLayout from "components/layouts/main";
import StoreDetailModal from "components/UI/StoreDetailModal";
import StoreTile from "components/UI/StoreTile";
import { GlobalContext } from "context/global";
import useStoreSearch from "hooks/useStoreSearch";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { StoreLocatorContext } from "context/storelocator";
import Modal from "components/UI/ModalPopup";
import { Store } from "interfaces/storelocatorContext";
import getStoresByCoordinatesFetcher, {
    getStoresByCoordinatesQuery,
} from "bdConnector/storeLocator/getStoresByCoordinates";
import { FetcherResponse } from "bdConnector/types";
import Head from "next/head";
import Map from "components/UI/GoogleMap/Map";
import DotsLoader from "components/UI/DotsLoader";

interface StoreLocatorProps {
    initialStores: Store[];
    i18: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
    globalResources: Record<string, string>;
    errorCode: string | null;
}

const StoreLocator = ({
    initialStores,
    i18,
    locale,
    globalData,
    globalResources,
    errorCode,
}: StoreLocatorProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const { deliveryMethodId, setDeliveryMethodId, selectedStore } = useContext(StoreLocatorContext);
    const [storeDetailSelectedStore, setStoreDetailSelectedStore] = useState<Store>(null);
    const [storeDetailModalState, setStoreDetailsModalState] = useState(false);
    const placesApiServiceHelperRef = useRef<HTMLDivElement>(null);
    const {
        confirmChangeStore,
        handleSelectedStore,
        isChangeStorePopupVisible,
        setIsChangeStorePopupVisible,
    } = useContext(StoreLocatorContext);

    const { fetching, stores, handleUseCurrentLocation, searchText, handleSearch, googleScriptLoaded } = useStoreSearch(
        {
            serviceHelperRef: placesApiServiceHelperRef,
            locale,
            deliveryMethodId,
            internalServerError: globalResources.internalServerError,
            deniedGeolocationError: globalResources.deniedGeolocation,
            defaultStoreSearchRadius: globalData.data.storelocatorConfigs.defaultStoreSearchRadius,
        }
    );

    useEffect(() => {
        if (errorCode) {
            globalContext.showNotification({
                type: "error",
                message: globalResources.internalServerError,
                autoClose: true,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorCode]);

    const openStoreDetailModal = (store: Store): void => {
        setStoreDetailSelectedStore(store);
        setStoreDetailsModalState(true);
    };

    const closeStoreDetailModal = (): void => {
        setStoreDetailsModalState(false);
        setStoreDetailSelectedStore(null);
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
                locale={locale}
            >
                <div className="grid grid-cols-12">
                    <div className="col-span-full lg:col-span-5 xl:col-span-3 py-4">
                        <div className="px-6 search-container">
                            <div className="relative">
                                <i className="icon-search absolute text-xl text-t-secondary-2 search-icon"></i>
                                <input
                                    onChange={handleSearch}
                                    value={searchText}
                                    className={`w-full bg-bgr-faded py-2 pl-11 pr-4 rounded-3xl`}
                                    type="text"
                                    placeholder={i18.searchInputPlaceholder}
                                />
                                <button
                                    title={i18.useCurrentLocationHint}
                                    tabIndex={0}
                                    onClick={handleUseCurrentLocation}
                                >
                                    <i className="icon-crosshair text-xl absolute input-icon text-t-disabled"></i>
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    className={`${
                                        deliveryMethodId === globalData.data.storelocatorConfigs.addressDeliveryMethodId
                                            ? "bg-bgr-tertiary primary text-t-tertiary"
                                            : ""
                                    } text-center w-full p-2 rounded-3xl font-primary text-sm btn icon-delivery-2 font-bold mr-2`}
                                    onClick={() =>
                                        setDeliveryMethodId(globalData.data.storelocatorConfigs.addressDeliveryMethodId)
                                    }
                                >
                                    {i18.deliveryLabel}
                                </button>
                                <button
                                    className={`${
                                        deliveryMethodId === globalData.data.storelocatorConfigs.pickUpInStoreMethodId
                                            ? "bg-bgr-tertiary primary text-t-tertiary"
                                            : ""
                                    } text-center w-full p-2 rounded-3xl font-primary text-sm btn icon-store-1 font-bold`}
                                    onClick={() =>
                                        setDeliveryMethodId(globalData.data.storelocatorConfigs.pickUpInStoreMethodId)
                                    }
                                >
                                    {i18.collectionLabel}
                                </button>
                            </div>
                            <span className="block py-2 font-bold font-primary text-t-primary text-sm">
                                {(!stores?.length ? initialStores : stores).length} {i18.storesCountLabel}
                            </span>
                        </div>
                        <div
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 px-4 pt-6 search-results lg:overflow-y-scroll`}
                        >
                            {!fetching ? (
                                (!stores?.length ? initialStores : stores).map((store) => (
                                    <StoreTile
                                        selectedStoreId={selectedStore?.id}
                                        chooseStoreLabel={i18.chooseStore}
                                        store={store}
                                        storeDetailsModalHandler={() => openStoreDetailModal(store)}
                                        selectStoreHandler={() => handleSelectedStore(store)}
                                        key={store.id}
                                    />
                                ))
                            ) : (
                                <div className="text-center h-custom">{i18.loadingMsg}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-full order-first lg:order-none lg:col-span-7 xl:col-span-9">
                        {googleScriptLoaded ? (
                            <>
                                <Map
                                    markerClicked={(store) => openStoreDetailModal(store)}
                                    pins={!stores?.length ? initialStores : stores}
                                />
                                <div ref={placesApiServiceHelperRef} />
                            </>
                        ) : (
                            <div className="fetching-map flex items-center justify-center">
                                <DotsLoader variant="dark" />
                            </div>
                        )}
                    </div>
                    <StoreDetailModal
                        selectedStoreId={selectedStore?.id}
                        selectStoreHandler={() => handleSelectedStore(storeDetailSelectedStore)}
                        i18={i18}
                        closeModalHandler={closeStoreDetailModal}
                        closeModalKeyboardHandler={(e) => {
                            if (e.key === "Enter") {
                                closeStoreDetailModal();
                            }
                        }}
                        largeViewportBreakpoint={globalContext.viewports.large}
                        storeDetailSelectedStore={{
                            ...storeDetailSelectedStore,
                        }}
                        modalState={storeDetailModalState}
                    />
                    <Modal
                        actionFunction={confirmChangeStore}
                        title={globalResources.changeStoreConfirmTitle}
                        text={globalResources.changeStoreConfirmText}
                        isPopupVisible={isChangeStorePopupVisible}
                        yesText={globalResources.changeStoreYes}
                        noText={globalResources.changeStoreNo}
                        onClose={() => setIsChangeStorePopupVisible(false)}
                    />
                </div>
            </MainLayout>
            <style jsx>{`
                .input-icon {
                    top: 4px;
                    right: 8px;
                }

                .search-icon {
                    top: 4px;
                    left: 8px;
                }

                .btn:before {
                    margin-right: 10px;
                    font-size: 21px;
                }

                .search-container {
                    box-shadow: 0 4px 6px -2px var(--br-secondary);
                }

                .fetching-map {
                    height: calc(100vh - 64px);
                }

                .h-custom {
                    min-height: 500px;
                }

                @media only screen and (min-width: ${globalContext.viewports.large}px) {
                    .search-results {
                        height: calc(100vh - 242px);
                    }
                }
            `}</style>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<StoreLocatorProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during category page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    const { data: initialStores, errorCode } = await getStoresByCoordinatesFetcher(getStoresByCoordinatesQuery, {
        latitude: globalData.data.storelocatorConfigs.defaultLatitude,
        longitude: globalData.data.storelocatorConfigs.defaultLongitude,
        maxDistance: globalData.data.storelocatorConfigs.defaultStoreSearchRadius,
        deliveryMethodId: globalData.data.storelocatorConfigs.defaultDeliveryMethodId,
        locale,
    });

    return {
        props: {
            locale,
            globalData,
            initialStores: initialStores ?? [],
            errorCode: errorCode ?? null,
            i18: {
                deliveryLabel: i18n.t("storelocator:delivery"),
                collectionLabel: i18n.t("storelocator:collection"),
                chooseStore: i18n.t("storelocator:chooseStore"),
                loadingMsg: i18n.t("storelocator:loadingMsg"),
                storesCountLabel: i18n.t("storelocator:storesCountLabel"),
                searchInputPlaceholder: i18n.t("storelocator:searchInputPlaceholder"),
                useCurrentLocationHint: i18n.t("storelocator:useCurrentLocationHint"),
                pageTitle: i18n.t("storelocator:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default StoreLocator;
