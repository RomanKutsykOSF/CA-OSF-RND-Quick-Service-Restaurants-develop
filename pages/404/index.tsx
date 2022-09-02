import React, { useContext } from "react";
import { GlobalContext } from "../../context/global";
import MainLayout from "components/layouts/main";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import i18nInit from "i18";
import populateGlobalResources from "i18/populateGlobalResources";
import Title from "components/UI/Title";
import Button from "components/UI/Button";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import { FetcherResponse } from "bdConnector/types";
import Head from "next/head";

interface NotFoundProps {
    globalResources: Record<string, string>;
    locale: string;
    i18: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
}

const NotFound = ({ i18, globalResources, globalData, locale }: NotFoundProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    return (
        <>
            <Head>
                <title>{i18.pageTitle}</title>
                <meta property="og:title" content={i18.pageTitle} key="title" />
            </Head>
            <MainLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                locale={locale}
                globalData={globalData}
            >
                <CenterContentWrapper>
                    <div className="py-32">
                        <Title type="h1">{i18.notFoundTitle}</Title>
                        <p className="text-center mt-4 mb-6 font-bold">{i18.notFoundSubtitle}</p>
                        <Button link="/" className="m-auto block" variant="primary">
                            {i18.notFoundButton}
                        </Button>
                    </div>
                </CenterContentWrapper>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<NotFoundProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during Login Register i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            globalData,
            locale,
            i18: {
                notFoundTitle: i18n.t("notFound:title"),
                notFoundSubtitle: i18n.t("notFound:subtitle"),
                notFoundButton: i18n.t("notFound:button"),
                pageTitle: i18n.t("notFound:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default NotFound;
