import { PlpData } from "pages/store/[categoryId]/products/index";
import { AppliedFilter } from "components/plp/Filters";
import { FetcherResponse } from "bdConnector/types";

export const getPlpDataQuery = `
    query GetPlpData($siteId: String!, $categoryId: String!, $locale: String!, $limit: Float, $offset: Float, $filters: [Filter!]) {
        plpData: getPlpData(siteId: $siteId, categoryId: $categoryId, locale: $locale, limit: $limit, offset: $offset, filters: $filters) {
        name
        resultsQty
        imgDesktopUrl
        imgMobileUrl
        filters {
            id
            name
            type
            isCategoryFilter
            values {
            id
            name
            resultsCount
            }
        }
        productsList {
            id
            name
            imgUrl
            price
            weight
            isAvailableInStore
        }
        subCategories {
            categoryLogo
            id
            name
            parentCategoryId
        }
        isStoreSelected
        }
    }
`;

const getPlpDataFetcher = async function (
    query: string,
    categoryId: string,
    locale: string,
    offset?: number,
    limit?: number,
    filters?: AppliedFilter[]
): Promise<FetcherResponse<PlpData>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;
    if (!filters) {
        filters = [];
    }

    let response;
    if (!query) {
        return;
    }

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
                    categoryId,
                    offset,
                    limit,
                    filters,
                },
            }),
        });
    } catch (error) {
        return {
            data: {
                filters: [],
                imgDesktopUrl: "",
                imgMobileUrl: "",
                name: "",
                resultsQty: 0,
                subCategories: [],
                productsList: [],
                isStoreSelected: false,
            },
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await response.json();

    if (data !== null) {
        return {
            data: {
                name: data?.plpData?.name || "",
                resultsQty: data?.plpData?.resultsQty || 0,
                filters: data?.plpData?.filters || [],
                imgDesktopUrl: data?.plpData?.imgDesktopUrl || "/images/no-image-icon.png",
                imgMobileUrl: data?.plpData?.imgMobileUrl || "/images/no-image-icon.png",
                subCategories: data?.plpData?.subCategories || [],
                productsList: data?.plpData?.productsList || [],
                isStoreSelected: data?.plpData?.isStoreSelected,
            },
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};
export default getPlpDataFetcher;
