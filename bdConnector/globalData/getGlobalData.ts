import { FetcherResponse } from "bdConnector/types";
import { GlobalData } from "interfaces/globalContext";

export const getGlobalDataQuery = `
    query Query(
        $locale: String!
        $siteId: String!
    ) {
        getGlobalData(
        locale: $locale
        siteId: $siteId
        ) {
            globalData
        }
    }
`;

const getGlobalDataFetcher = async function (query: string, locale: string): Promise<FetcherResponse<GlobalData>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;

    let response;

    try {
        response = await fetch(process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                query,
                variables: {
                    siteId,
                    locale,
                },
            }),
        });
    } catch (error) {
        return {
            data: null,
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await response.json();

    if (data !== null) {
        return {
            data: JSON.parse(data.getGlobalData.globalData),
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getGlobalDataFetcher;
