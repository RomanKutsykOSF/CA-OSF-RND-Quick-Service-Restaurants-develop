import { FetcherResponse } from "bdConnector/types";
import { Store } from "interfaces/storelocatorContext";

export const getStoreByIdQuery = `
    query GetStoreById($siteId: String!, $storeId: String!) {
        getStoreById(siteId: $siteId, storeId: $storeId) {
            name
            id
        }
    }
`;

const getStoreByIdFetcher = async (query: string, storeId: string): Promise<FetcherResponse<Store>> => {
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
            data: data.getStoreById,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getStoreByIdFetcher;
