import { FetcherResponse } from "bdConnector/types";

export const getProductPriceQuery = `
    query Query(
        $qty: Float!
        $ingredients: String!
        $locale: String!
        $productId: String!
        $siteId: String!
    ) {
        getProductPrice(
        qty: $qty
        ingredients: $ingredients
        locale: $locale
        productId: $productId
        siteId: $siteId
        ) {
        unitPrice
        totalPrice
        }
    }
`;

export interface ProductPrice {
    unitPrice: string;
    totalPrice: string;
}

const getProductPriceFetcher = async function (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    query: any,
    productId: string,
    qty: number,
    ingredients: string,
    locale: string
): Promise<FetcherResponse<ProductPrice>> {
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
                    qty,
                    ingredients,
                    locale,
                    productId,
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
            data: data.getProductPrice,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getProductPriceFetcher;
