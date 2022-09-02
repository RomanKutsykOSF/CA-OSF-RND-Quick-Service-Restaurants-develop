import { FetcherResponse } from "bdConnector/types";
import { groupItemsByStoreId } from "./getPublicWishlist";

export const getCustomerWishlistQuery = `
    query Query($locale: String!, $siteId: String!) {
        getCustomerWishlists(locale: $locale, siteId: $siteId) {
        wishlistId
        public
            customerProductListItems {
                id
                productId
                image
                name
                size
                quantity
                price
                storeId
            }
        }
    }
`;

export interface WishlistProductItem {
    id: string;
    productId: string;
    image: string;
    name: string;
    size: string;
    quantity: number;
    price: string;
    storeId?: string;
}

export interface GetCustomerWishlistQueryResponse {
    wishlistId: string;
    public: boolean;
    customerProductListItems: WishlistProductItem[];
    perStoreProductListItems: {
        id: string;
        name: string;
        items: WishlistProductItem[];
    }[];
}

const getCustomerWishlistFetcher = async function (
    query: string,
    locale: string
): Promise<FetcherResponse<GetCustomerWishlistQueryResponse>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;

    let wishlistProductsJSON;

    try {
        wishlistProductsJSON = await fetch(process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT, {
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

    const { errors, data } = await wishlistProductsJSON.json();

    if (data !== null) {
        return {
            data: {
                ...data.getCustomerWishlists,
                perStoreProductListItems: await groupItemsByStoreId(data.getCustomerWishlists.customerProductListItems),
            },
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getCustomerWishlistFetcher;
