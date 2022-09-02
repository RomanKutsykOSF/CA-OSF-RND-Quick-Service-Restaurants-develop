import { FetcherResponse } from "bdConnector/types";
import { Address } from "interfaces/checkout";

export const updateWishlistMutation = `
    mutation Mutation($locale: String!, $public: Boolean!, $wishlistId: String!, $siteId: String!) {
        updateCustomerWishlist(locale: $locale, public: $public, wishlistId: $wishlistId, siteId: $siteId) {
        status
        }
    }
`;

const updateWishlistFetcher = async function (
    query: string,
    wishlistId: string,
    publicWishlist: boolean,
    locale: string
): Promise<FetcherResponse<Address>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;

    let updateWishlistRes;

    try {
        updateWishlistRes = await fetch(process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT, {
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
                    public: publicWishlist,
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

    const { errors, data } = await updateWishlistRes.json();

    if (data !== null) {
        return {
            data: data.updateCustomerWishlist,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default updateWishlistFetcher;
