import "../styles/globals.css";
import "../styles/font/icons/families/stylesheet.css";

import React from "react";
import { AppProps } from "next/app";
import "../styles/font/icons/fontello/css/fontello.css";
import GlobalContextProvider from "../context/global";
import StoreLocatorContextProvider from "context/storelocator";

function MyApp({ Component, pageProps }: AppProps): any {
    return (
        <GlobalContextProvider>
            <StoreLocatorContextProvider>
                <Component {...pageProps} />
            </StoreLocatorContextProvider>
        </GlobalContextProvider>
    );
}

export default MyApp;
