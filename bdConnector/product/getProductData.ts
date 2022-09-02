import { FetcherResponse } from "bdConnector/types";
import { ProductData } from "interfaces/pdp";

export const getProductDataQuery = `
    query GetProduct($locale: String!, $siteId: String!, $productId: String!) {
        getProduct(locale: $locale, siteId: $siteId, productId: $productId) {
            badges
            id
            name
            shortDescription
            weight
            inventory {
                ats
                backorderable
                id
                orderable
                preorderable
                stockLevel
            }
            ingredientGroups {
                id
                name
                items {
                    id
                    max
                    min
                    name
                    qty
                    price {
                        displayValue
                        value
                    }
                    imgUrl
                    initialQty
                }
            }
            price
            imgSquare {
                alt
                title
                url
            }
            imgLandscape {
                alt
                title
                url
            }
            parentCategoryId
            minQty
            maxQty
            isProductSavedInWishlist
            sizeTiles {
                id
                isActive
                title
                subTitle
                price
            }
            tabs {
                id
                title
                content
            }
            isMasterProduct
            isStoreSelected
        }
    }
`;

const getProductDataFetcher = async function (
    query: string,
    productId: string,
    locale: string
): Promise<FetcherResponse<ProductData>> {
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
                    productId,
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

    const { errors, data } = await response.json();

    if (errors) {
        throw new Error(errors[0].extensions.code);
    }

    return {
        data: data.getProduct,
        errorCode: null,
    };
};
export default getProductDataFetcher;
