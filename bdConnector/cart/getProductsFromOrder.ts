import { FetcherResponse } from "bdConnector/types";

export const getProductsFromOrderQuery = `
    query Query($orderNo: String!, $locale: String!, $siteId: String!) {
        getProductsFromOrder(orderNo: $orderNo, locale: $locale, siteId: $siteId) {
            productItems {
                productName
                price
                productId
                imgUrl
                isAvailableInStore
                ingredientsString
                quantity
                size
            }
        }
    }
`;

export interface ProductFromOrder {
    productItems: {
        productName: string;
        price: string;
        productId: string;
        imgUrl: string;
        isAvailableInStore: boolean;
        ingredientsString: string;
        quantity: number;
    }[];
}

const getProductsFromOrderFetcher = async function (
    query: string,
    locale: string,
    orderNo: string
): Promise<FetcherResponse<ProductFromOrder>> {
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
                    orderNo,
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
        if (data.getProductsAvailability !== null) {
            return {
                data: data.getProductsFromOrder,
                errorCode: null,
            };
        }

        return {
            data: null,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getProductsFromOrderFetcher;
