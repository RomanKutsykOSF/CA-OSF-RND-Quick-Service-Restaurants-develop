import { FetcherResponse } from "bdConnector/types";

export const getIsrPreRenderedPdpsQuery = `
    query GetIsrPreRenderedPdps($locale: String!, $siteId: String!) {
        getIsrPreRenderedPdps(locale: $locale, siteId: $siteId) {
        name
        id
        }
    }
`;

const getIsrPreRenderedPdpsFetcher = async function (
    query: string,
    locale: string
): Promise<FetcherResponse<string[]>> {
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
            data: [],
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await response.json();

    if (data !== null) {
        return {
            data: data.getIsrPreRenderedPdps,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};
export default getIsrPreRenderedPdpsFetcher;
