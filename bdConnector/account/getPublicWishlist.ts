import getStoreByIdFetcher, { getStoreByIdQuery } from "bdConnector/storeLocator/getStoreById";
import { FetcherResponse } from "bdConnector/types";
import { GetCustomerWishlistQueryResponse, WishlistProductItem } from "./getCustomerWishlist";

export const getPublicWishlistQuery = `
    query GetPublicWishlist($wishlistId: String!, $siteId: String!) {
        getPublicWishlist(wishlistId: $wishlistId, siteId: $siteId) {
            wishlistId
            public
            customerProductListItems {
                image
                productId
                id
                name
                size
                quantity
                price
                storeId
            }
        }
    }
`;

export const groupItemsByStoreId = async (productList: WishlistProductItem[]): Promise<any> => {
    if (!productList) return [];

    const storeIds = [...Array.from(new Set(productList.map((el) => el.storeId)))];

    const storeDataList = [];

    for (const ID of storeIds) {
        const { data } = await getStoreByIdFetcher(getStoreByIdQuery, ID);
        storeDataList.push({ id: ID, name: data.name });
    }

    if (storeDataList.length > 0) {
        return storeDataList.reduce((acc, curr) => {
            const items = productList.filter((el) => el.storeId === curr.id);

            if (items.length > 0) {
                acc.push({
                    ...curr,
                    items,
                });
            }
            return acc;
        }, []);
    }

    return [];
};

const getPublicWishlistFetcher = async function (
    query: string,
    wishlistId: string
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

    const { errors, data } = await wishlistProductsJSON.json();

    if (errors) {
        throw new Error(errors[0].extensions.code);
    }

    return {
        data: {
            ...data.getPublicWishlist,
            perStoreProductListItems: await groupItemsByStoreId(data.getPublicWishlist.customerProductListItems),
        },
        errorCode: null,
    };
};

export default getPublicWishlistFetcher;
