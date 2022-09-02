import React, { ReactNode, useContext, useEffect } from "react";
import Head from "next/head";
import Footer from "components/UI/footer/Footer";
import { useRouter } from "next/router";
import { GlobalContext } from "context/global";
import Preloader from "components/UI/Preloader";
import Navigation from "components/UI/header/Navigation/Navigation";
import { StoreLocatorContext } from "context/storelocator";
import getCartDataFetcher, { getCartQuery } from "bdConnector/cart/getCartData";
import getGlobalUserDataFetcher, { getGlobalUserDataQuery } from "bdConnector/account/getGlobalUserData";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import useSWR from "swr";
import Notification from "components/UI/Notification";
import ScreenLoader from "components/UI/ScreenLoader";
import getSelectedStoreFetcher, { getSelectedStoreQuery } from "bdConnector/storeLocator/getSelectedStore";
import { FetcherResponse } from "bdConnector/types";

interface MainLayoutProps {
    themeVariables: string;
    children: ReactNode;
    globalResources?: Record<string, string>;
    i18?: Record<string, string>;
    navigationMode?: "default" | "overflow";
    globalData: FetcherResponse<GlobalData>;
    isPageLoginProtected?: boolean;
    locale: string;
    disableFooterTopMargin?: boolean;
}

const MainLayout = ({
    themeVariables,
    children,
    globalResources,
    navigationMode,
    globalData,
    isPageLoginProtected,
    disableFooterTopMargin,
    locale,
}: MainLayoutProps): JSX.Element => {
    navigationMode = navigationMode ? navigationMode : "default";
    const router = useRouter();
    const globalContext = useContext(GlobalContext);
    const { setSelectedStore, selectedStore, setDefaultDeliveryMethodId } = useContext(StoreLocatorContext);

    useEffect(() => {
        window.document.querySelector("body").setAttribute("style", themeVariables);
    }, [themeVariables]);

    useEffect(() => {
        const enableLoaderHandler = (): void => {
            globalContext.setPageTransitionLoader(true);
        };

        const disableLoaderHandler = (): void => {
            globalContext.setPageTransitionLoader(false);
        };

        router.events.on("routeChangeStart", enableLoaderHandler);
        router.events.on("routeChangeComplete", disableLoaderHandler);
        router.events.on("routeChangeError", disableLoaderHandler);

        return () => {
            router.events.off("routeChangeStart", enableLoaderHandler);
            router.events.off("routeChangeComplete", disableLoaderHandler);
            router.events.off("routeChangeError", disableLoaderHandler);
        };
    }, [router.events, globalContext]);

    const { data: storeResponse, isValidating: selectedStoreValidating, mutate: getSelectedStoreMutator } = useSWR(
        [getSelectedStoreQuery],
        getSelectedStoreFetcher
    );

    const { data: cartData, mutate: useSwrGetCartMutate, isValidating: cartIsValidating } = useSWR(
        [getCartQuery],
        getCartDataFetcher
    );

    const { data: useSwrUserData, mutate: useSwrGetUserDataMutate, isValidating: userDataIsValidating } = useSWR(
        [getGlobalUserDataQuery],
        getGlobalUserDataFetcher
    );

    const { data: useSwrGlobalData } = useSWR([getGlobalDataQuery, locale], getGlobalDataFetcher, {
        fallbackData: globalData,
    });

    useEffect(() => {
        globalContext.setCartValidating(cartIsValidating);

        if (!cartIsValidating) {
            globalContext.setUseSwrGetCartMutate(useSwrGetCartMutate);
            globalContext.setBasket(cartData?.data ?? null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartIsValidating, cartData]);

    useEffect(() => {
        if (storeResponse) {
            setSelectedStore(storeResponse?.data ?? null);
        }

        globalContext.setGetSelectedStoreMutate(getSelectedStoreMutator);

        if (useSwrUserData) {
            globalContext.setUseSwrGetUserDataMutate(useSwrGetUserDataMutate);
            globalContext.setIsUserLoggedIn(useSwrUserData?.data?.isLoggedIn);
        }

        setDefaultDeliveryMethodId(globalData?.data?.storelocatorConfigs?.defaultDeliveryMethodId ?? null);
    }, [
        locale,
        useSwrGlobalData,
        useSwrUserData,
        useSwrGetUserDataMutate,
        userDataIsValidating,
        globalContext,
        storeResponse,
        setSelectedStore,
        selectedStoreValidating,
        setDefaultDeliveryMethodId,
        globalData?.data?.storelocatorConfigs?.defaultDeliveryMethodId,
        getSelectedStoreMutator,
    ]);

    useEffect(() => {
        // handle unauthorized user redirect logic
        if (!useSwrUserData?.data?.isLoggedIn && isPageLoginProtected && !userDataIsValidating) {
            router.push("/login");
        }

        if (
            useSwrUserData?.data?.isLoggedIn &&
            !userDataIsValidating &&
            (router.pathname === "/login" || router.pathname === "/register")
        ) {
            router.push("/account/profile");
        }
    }, [useSwrUserData, isPageLoginProtected, router, userDataIsValidating]);

    const generateLocaleKeyTexts = (): any => {
        const localeKeyTexts = {};
        process.env.NEXT_PUBLIC_LOCALES?.split(",")?.forEach((localeKey) => {
            localeKeyTexts[localeKey] = globalResources[localeKey];
        });

        return localeKeyTexts;
    };

    return (
        <>
            <Head>
                <link rel="icon" href="/OSF_DIGITAL_white_logo.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </Head>
            <div>
                {globalContext.pageTransitionLoader ? <Preloader /> : null}
                {globalContext.screenBlockLoader ? <ScreenLoader /> : null}

                <Navigation
                    isSearchExpanded={globalContext?.isSearchExpanded}
                    isFetchingSearchResults={globalContext?.isFetchingSearchResults}
                    searchCallbackFunction={(searchText) => {
                        globalContext?.searchFunction(searchText, storeResponse?.data?.id, locale);
                    }}
                    categorySearchResults={globalContext?.categorySearchResults}
                    productSearchResults={globalContext?.productSearchResults}
                    setIsSearchExpanded={globalContext?.setIsSearchExpanded}
                    basket={globalContext?.basket}
                    logo={{
                        logoRedirectUrl: selectedStore ? `/store/${selectedStore.id}` : "/",
                        logoImgPath: useSwrGlobalData?.data?.sitePreferences?.siteLogo,
                    }}
                    isUserLoggedIn={useSwrUserData?.data?.isLoggedIn}
                    overflow={navigationMode === "overflow"}
                    links={
                        storeResponse?.data
                            ? useSwrGlobalData?.data?.navigationData?.links
                            : useSwrGlobalData?.data?.navigationData?.noStoreSelectedLinks
                    }
                    locale={locale}
                    textResources={{
                        searchPlaceholder: globalResources.searchPlaceholderText,
                        searchCategoriesTile: globalResources.searchCategoriesTileText,
                        searchProductsTile: globalResources.searchProductsTileText,
                        changeLocation: globalResources.changeLocation,
                        yourOrder: globalResources.yourOrder,
                        item: globalResources.item,
                        items: globalResources.items,
                        total: globalResources.total,
                        checkout: globalResources.checkout,
                        viewCart: globalResources.viewCart,
                        remove: globalResources.removeText,
                        localesTextMap: {
                            localeKeyTexts: generateLocaleKeyTexts(),
                        },
                        serverError: globalResources.internalServerError,
                        searchNoResults: globalResources.searchNoResultsFound,
                        productNotAvailableText: globalResources.productNotAvailableText,
                        tax: globalResources.tax,
                        deliveryFee: globalResources.deliveryFee,
                    }}
                />

                <div className="right-0 absolute p-4 z-30 max-w-md overflow-x-hidden">
                    <Notification
                        isVisible={globalContext.activeNotification.isVisible}
                        type={globalContext.activeNotification.type}
                        message={globalContext.activeNotification.message}
                        autoClose={globalContext.activeNotification.autoClose}
                        onClose={globalContext.closeNotification}
                    />
                </div>

                {children}

                <Footer
                    icons={useSwrGlobalData?.data?.footerData?.icons}
                    copyright={useSwrGlobalData?.data?.footerData?.copyright}
                    columns={useSwrGlobalData?.data?.footerData?.columns}
                    logo={useSwrGlobalData?.data?.footerData?.logo}
                    disableFooterTopMargin={disableFooterTopMargin || false}
                />

                <style>{`
                    body {
                        ${themeVariables}
                    }
                `}</style>
            </div>
        </>
    );
};

export default MainLayout;
