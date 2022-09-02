import React, { ReactNode, useContext, useEffect } from "react";
import Footer from "components/UI/footer/Footer";
import { useRouter } from "next/router";
import { GlobalContext } from "context/global";
import Preloader from "components/UI/Preloader";
import { StoreLocatorContext } from "context/storelocator";
import getCartDataFetcher, { getCartQuery } from "bdConnector/cart/getCartData";
import getGlobalUserDataFetcher, { getGlobalUserDataQuery } from "bdConnector/account/getGlobalUserData";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import useSWR from "swr";
import Notification from "components/UI/Notification";
import getSelectedStoreFetcher, { getSelectedStoreQuery } from "bdConnector/storeLocator/getSelectedStore";
import { FetcherResponse } from "bdConnector/types";
import Link from "next/link";
import Image from "next/image";
import ScreenLoader from "components/UI/ScreenLoader";

interface checkoutLayoutProps {
    themeVariables: string;
    children: ReactNode;
    globalResources?: Record<string, string>;
    navigationMode?: "default" | "overflow";
    globalData: FetcherResponse<GlobalData>;
    locale: string;
}

const CheckoutLayout = ({
    themeVariables,
    children,
    navigationMode,
    globalData,
    locale,
}: checkoutLayoutProps): JSX.Element => {
    navigationMode = navigationMode ? navigationMode : "default";
    const router = useRouter();
    const globalContext = useContext(GlobalContext);
    const { setSelectedStore } = useContext(StoreLocatorContext);

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

    const { data: storeResponse, isValidating: selectedStoreValidating } = useSWR(
        [getSelectedStoreQuery],
        getSelectedStoreFetcher
    );

    const { data: cartData, mutate: useSwrGetCartMutate, isValidating: cartIsValidating } = useSWR(
        [getCartQuery],
        getCartDataFetcher,
        { revalidateOnFocus: false }
    );

    const { data: useSwrUserData, mutate: useSwrGetUserDataMutate, isValidating: userDataIsValidating } = useSWR(
        [getGlobalUserDataQuery],
        getGlobalUserDataFetcher
    );

    const { data: useSwrGlobalData } = useSWR([getGlobalDataQuery, locale], getGlobalDataFetcher, {
        fallbackData: globalData,
    });

    useEffect(() => {
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

        if (useSwrUserData) {
            globalContext.setUseSwrGetUserDataMutate(useSwrGetUserDataMutate);
        }
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
    ]);

    return (
        <>
            {globalContext.pageTransitionLoader ? <Preloader /> : null}
            {globalContext.screenBlockLoader ? <ScreenLoader /> : null}
            <div className="absolute z-50 right-0 top-16 p-4 max-w-md overflow-x-hidden">
                <Notification
                    isVisible={globalContext.activeNotification.isVisible}
                    type={globalContext.activeNotification.type}
                    message={globalContext.activeNotification.message}
                    autoClose={globalContext.activeNotification.autoClose}
                    onClose={globalContext.closeNotification}
                />
            </div>
            <div className={`checkout ${navigationMode}`}>
                {globalContext.pageTransitionLoader ? <Preloader /> : null}
                <div className="checkout__header">
                    <Link href="/">
                        <a className="block mx-auto py-5 w-32">
                            <Image
                                width={137}
                                height={18}
                                src={useSwrGlobalData?.data?.sitePreferences?.siteLogo || "/images/no-image-icon.png"}
                                alt="site-logo"
                            />
                        </a>
                    </Link>
                </div>
                <div className="checkout__content">{children}</div>
                <Footer
                    copyright={useSwrGlobalData?.data?.footerData?.copyright}
                    logo={useSwrGlobalData?.data?.footerData?.logo}
                />
                <style jsx>{`
                    body {
                        ${themeVariables}
                    }
                `}</style>
                <style jsx>{`
                    .checkout__header {
                        border-bottom: 1px solid var(--br-disabled);
                    }
                `}</style>
            </div>
        </>
    );
};

export default CheckoutLayout;
