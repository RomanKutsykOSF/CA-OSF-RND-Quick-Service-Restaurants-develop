import React, { useContext } from "react";
import i18nInit from "i18";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { GlobalContext } from "../../context/global";
import CheckoutLayout from "components/layouts/checkout";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import EntryPortal from "components/UI/EntryPortal";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { FetcherResponse } from "bdConnector/types";

interface CheckoutLoginRegisterProps {
    i18: Record<string, string>;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
}

const CheckoutLoginRegister = ({ i18, globalData, locale }: CheckoutLoginRegisterProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <CheckoutLayout themeVariables={globalContext.themeCssString} globalData={globalData} locale={locale}>
            <CenterContentWrapper>
                <EntryPortal
                    title={i18.entryPortalTitle}
                    subtitle1={i18.entryPortalSubtitle1}
                    subtitle2={i18.entryPortalSubtitle2}
                    btn1Text={i18.entryPortalBtn1Text}
                    btn2Text={i18.entryPortalBtn2Text}
                    btn3Text={i18.entryPortalBtn3Text}
                    btn1Link="/register"
                    btn2Link="/login"
                    btn3Link="/"
                />
            </CenterContentWrapper>
        </CheckoutLayout>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<CheckoutLoginRegisterProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during Login Register i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData: globalData,
            i18: {
                entryPortalTitle: i18n.t("entryPortalCheckout:title"),
                entryPortalSubtitle1: i18n.t("entryPortalCheckout:subtitle1"),
                entryPortalSubtitle2: i18n.t("entryPortalCheckout:subtitle2"),
                entryPortalBtn1Text: i18n.t("entryPortalCheckout:btn1Text"),
                entryPortalBtn2Text: i18n.t("entryPortalCheckout:btn2Text"),
                entryPortalBtn3Text: i18n.t("entryPortalCheckout:btn3Text"),
            },
        },
    };
};

export default CheckoutLoginRegister;
