import { WishlistProductItem } from "bdConnector/account/getCustomerWishlist";
import { FetcherResponse } from "bdConnector/types";

export const addProductToWishListMutation = `
    mutation Mutation($item: WishlistItemArgs!, $siteId: String!) {
        addWishlistProduct(item: $item, siteId: $siteId) {
            id
            priority
            productId
            public
            type
            quantity
            storeId
        }
    }
`;

interface WishlistItemInput {
    productId: string;
    priority: number;
    public: boolean;
    quantity: number;
    type: string;
    storeId: string;
}

const addProductToWishListHandler = async function (
    query: string,
    itemData: WishlistItemInput
): Promise<FetcherResponse<WishlistProductItem>> {
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
                    item: itemData,
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
            data: data.AddWishlistProduct,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default addProductToWishListHandler;
