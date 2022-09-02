import { FetcherResponse } from "bdConnector/types";

export const setSelectedStoreIdMutation = `
    mutation Mutation($storeId: String!, $siteId: String, $basketId: String) {
        setSelectedStoreId(storeId: $storeId, siteId: $siteId, basketId: $basketId) {
            status
        }
    }
`;

const setSelectedStoreIdFetcher = async (
    query: string,
    storeId: string,
    basketId: string
): Promise<FetcherResponse<{ status: string }>> => {
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
                    storeId,
                    siteId,
                    basketId,
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
            data: data.SetSelectedStoreId,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default setSelectedStoreIdFetcher;
