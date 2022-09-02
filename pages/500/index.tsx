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

interface ServerErrorProps {
    globalResources: Record<string, string>;
    locale: string;
    i18: Record<string, string>;
    globalData: FetcherResponse<GlobalData>;
}

const ServerError = ({ i18, globalResources, globalData, locale }: ServerErrorProps): JSX.Element => {
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
                        <Title type="h1">{i18.serverErrorTitle}</Title>
                        <p className="text-center mt-4 mb-6 font-bold">{i18.serverErrorSubtitle}</p>
                        <Button link="/" className="m-auto block" variant="primary">
                            {i18.serverErrorButton}
                        </Button>
                    </div>
                </CenterContentWrapper>
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<ServerErrorProps>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            globalData,
            locale,
            i18: {
                serverErrorTitle: i18n.t("serverError:title"),
                serverErrorSubtitle: i18n.t("serverError:subtitle"),
                serverErrorButton: i18n.t("serverError:button"),
                pageTitle: i18n.t("serverError:pageTitle"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default ServerError;
