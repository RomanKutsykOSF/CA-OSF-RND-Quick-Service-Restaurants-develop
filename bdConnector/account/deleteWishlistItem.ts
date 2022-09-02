import { FetcherResponse } from "bdConnector/types";
import { ProductLineItem } from "interfaces/globalContext";

export const deleteWishlistItemMutation = `
    mutation deleteWishlistItem($siteId: String!, $itemId: String!, $wishlistId: String!) {
        deleteWishlistItem(siteId: $siteId, itemId: $itemId, wishlistId: $wishlistId) {
            status
        }
    }
`;

const deleteWishlistItemFetcher = async function (
    query: string,
    itemId: string,
    wishlistId: string
): Promise<FetcherResponse<ProductLineItem>> {
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
                    itemId,
                    wishlistId,
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
            data: data.deleteWishlistItem,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default deleteWishlistItemFetcher;
