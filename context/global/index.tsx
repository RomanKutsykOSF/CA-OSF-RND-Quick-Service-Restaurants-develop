import React, { useState, useEffect, ReactNode } from "react";
import { ThemeCssVariables, GlobalContextDefaults, GlobalUserData, Basket } from "interfaces/globalContext";
import viewports from "../../config/viewports.json";
import colors from "../../config/colors.json";
import slugify from "slugify";
import getSearchResultsDataFetcher, { getSearchResultsDataQuery } from "bdConnector/siteSearch/getSearchResultsData";
import { NotificationProps } from "components/UI/Notification";
import { setTimeout } from "timers";
import { KeyedMutator } from "swr";
import { FetcherResponse } from "bdConnector/types";
import { Store } from "interfaces/storelocatorContext";

export const globalContextDefaults: GlobalContextDefaults = {
    viewports: viewports,
    pageTransitionLoader: false,
    setPageTransitionLoader: () => undefined,
    themeCssVariables: {
        colors: colors,
        fontfamilies: {
            "--font-family-primary": `'Barlow', sans-serif`,
        },
        typography: {
            "--animation-duration-default": "300ms",
        },
    },
    themeCssString: "",
    basket: null,
    setBasket: (basket: Basket) => basket,
    isSearchExpanded: false,
    productSearchResults: [],
    categorySearchResults: [],
    searchFunction: () => {
        return;
    },
    isFetchingSearchResults: false,
    setIsSearchExpanded: (state) => {
        return state;
    },
    isMinicartExpanded: false,
    setMinicartExpanded: (isExpanded) => {
        return isExpanded;
    },
    setThemeVariables: (themeVariablesJSON: ThemeCssVariables): any => {
        return themeVariablesJSON;
    },
    useSwrGetCartMutate: undefined,
    setUseSwrGetCartMutate: () => undefined,
    showNotification: ({ type, message, isVisible }) => {
        return { type, message, isVisible };
    },
    activeNotification: { message: "", type: "success", isVisible: false, autoClose: true },
    closeNotification: () => {
        return;
    },
    useSwrGetUserDataMutate: undefined,
    setUseSwrGetUserDataMutate: () => undefined,
    screenBlockLoader: false,
    setScreenBlockLoader: () => undefined,
    getSelectedStoreMutate: undefined,
    setGetSelectedStoreMutate: () => undefined,
    cartValidating: false,
    setCartValidating: () => undefined,
    isUserLoggedIn: false,
    setIsUserLoggedIn: (isLoggedIn) => {
        return isLoggedIn;
    },
};

export const GlobalContext = React.createContext(globalContextDefaults);

const GlobalContextProvider = (props: { children: ReactNode }): JSX.Element => {
    const [viewports] = useState(globalContextDefaults.viewports);
    const [useSwrGetCartMutate, setUseSwrGetCartMutate] = useState<KeyedMutator<FetcherResponse<Basket>>>(
        globalContextDefaults.useSwrGetCartMutate
    );
    const [themeCssVariables, setThemeCssVariables] = useState(globalContextDefaults.themeCssVariables);
    const [themeCssString, setThemeCssString] = useState(globalContextDefaults.themeCssString);
    const [pageTransitionLoader, setPageTransitionLoader] = useState(globalContextDefaults.pageTransitionLoader);
    const [screenBlockLoader, setScreenBlockLoader] = useState(globalContextDefaults.screenBlockLoader);
    const [isMinicartExpanded, setMinicartExpanded] = useState(globalContextDefaults.isMinicartExpanded);
    const [basket, setBasket] = useState(globalContextDefaults.basket);
    const [isSearchExpanded, setIsSearchExpanded] = useState(globalContextDefaults.isSearchExpanded);
    const [categorySearchResults, setCategorySearchResults] = useState(globalContextDefaults.categorySearchResults);
    const [productSearchResults, setProductSearchResults] = useState(globalContextDefaults.productSearchResults);
    const [isFetchingSearchResults, setIsFetchingSearchResults] = useState(
        globalContextDefaults.isFetchingSearchResults
    );
    const [notification, setNotification] = useState<NotificationProps>(globalContextDefaults.activeNotification);
    const [useSwrGetUserDataMutate, setUseSwrGetUserDataMutate] = useState<
        KeyedMutator<FetcherResponse<GlobalUserData>>
    >(globalContextDefaults.useSwrGetUserDataMutate);
    const [getSelectedStoreMutate, setGetSelectedStoreMutate] = useState<KeyedMutator<FetcherResponse<Store>>>(
        globalContextDefaults.getSelectedStoreMutate
    );
    const [cartValidating, setCartValidating] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(globalContextDefaults.isUserLoggedIn);

    const closeNotification = (): void => {
        setNotification({ ...notification, isVisible: false });
    };

    const defaultNotificationDuration = 6000;
    const showNotification = ({ type, autoClose, message }): void => {
        setNotification({ type, isVisible: true, message, autoClose });

        if (autoClose) {
            setTimeout(() => {
                closeNotification();
            }, defaultNotificationDuration);
        }
    };

    useEffect(() => {
        populateThemeCssString(themeCssVariables);
    }, [themeCssVariables]);

    const getSearchResults = async (searchText: string, selectedStoreId: string, locale: string): Promise<void> => {
        const MIN_CHAR_SEARCH = 3;

        if (searchText.length >= MIN_CHAR_SEARCH) {
            setIsFetchingSearchResults(true);
            const { data } = await getSearchResultsDataFetcher(getSearchResultsDataQuery, searchText, locale);

            const categories =
                data?.categorySearchResults.map((category) => {
                    return {
                        ...category,
                        link: `/store/${selectedStoreId}/products`,
                    };
                }) ?? [];

            const products =
                data?.productSearchResults.map((product) => {
                    return {
                        ...product,
                        link: `/product/${product.id}/${slugify(product.name)}`,
                    };
                }) ?? [];

            setCategorySearchResults(categories);
            setProductSearchResults(products);
            setIsFetchingSearchResults(false);
        }
    };

    const populateThemeCssString: any = (themeVariablesJSON: ThemeCssVariables) => {
        let cssString = "";

        Object.keys(themeVariablesJSON.fontfamilies).forEach((key) => {
            cssString += key + ":" + themeVariablesJSON.fontfamilies[key] + ";";
        });

        Object.keys(themeVariablesJSON.colors).forEach((key) => {
            cssString += key + ":" + themeVariablesJSON.colors[key] + ";";
        });

        Object.keys(themeVariablesJSON.typography).forEach((key) => {
            cssString += key + ":" + themeVariablesJSON.typography[key] + ";";
        });

        setThemeCssString(cssString);
    };

    return (
        <GlobalContext.Provider
            value={{
                viewports,
                themeCssVariables,
                themeCssString,
                pageTransitionLoader,
                setPageTransitionLoader: (state) => {
                    setPageTransitionLoader(state);
                },
                screenBlockLoader,
                setScreenBlockLoader: (state) => {
                    setScreenBlockLoader(state);
                },
                basket,
                setBasket,
                useSwrGetCartMutate: useSwrGetCartMutate,
                setUseSwrGetCartMutate: (useSwrGetCartMutateFun) => {
                    setUseSwrGetCartMutate(() => useSwrGetCartMutateFun);
                },
                isMinicartExpanded,
                setThemeVariables: (themeVariablesJSON) => {
                    return () => {
                        setThemeCssVariables(themeVariablesJSON);
                    };
                },
                setMinicartExpanded: (isExpanded) => {
                    setMinicartExpanded(isExpanded);
                },
                categorySearchResults,
                productSearchResults,
                isSearchExpanded,
                searchFunction: getSearchResults,
                setIsSearchExpanded: (state) => {
                    setIsSearchExpanded(state);
                },
                isFetchingSearchResults,
                activeNotification: notification,
                showNotification: (input: NotificationProps) => {
                    showNotification(input);
                },
                closeNotification,
                useSwrGetUserDataMutate: useSwrGetUserDataMutate,
                setUseSwrGetUserDataMutate: (mutatorFn) => {
                    setUseSwrGetUserDataMutate(() => mutatorFn);
                },
                getSelectedStoreMutate: getSelectedStoreMutate,
                setGetSelectedStoreMutate: (mutatorFn) => {
                    setGetSelectedStoreMutate(() => mutatorFn);
                },
                cartValidating,
                setCartValidating,
                isUserLoggedIn,
                setIsUserLoggedIn,
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    );
};

export default GlobalContextProvider;
