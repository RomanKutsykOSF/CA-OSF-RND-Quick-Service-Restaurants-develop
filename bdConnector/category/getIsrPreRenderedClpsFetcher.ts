import { FetcherResponse } from "bdConnector/types";

export const getIsrPreRenderedClpsFetcherQuery = `
    query Query($siteId: String!) {
        preRenderedClps: getIsrPreRenderedClps(siteId: $siteId)
    }
`;

const getIsrPreRenderedClpsFetcher = async function (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    query: any
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
            data: data.preRenderedClps,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};
export default getIsrPreRenderedClpsFetcher;
