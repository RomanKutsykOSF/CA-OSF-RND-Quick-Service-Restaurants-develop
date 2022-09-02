import { FetcherResponse } from "bdConnector/types";
import { CategorySearchItemInterface, ProductSearchItemInterface } from "interfaces/globalContext";

export const getSearchResultsDataQuery = `
    query GetSearchResults($locale: String!, $siteId: String!, $query: String!) {
        getSearchResults(locale: $locale, siteId: $siteId, query: $query) {
            productSearchResults {
                id
                name
                price
                image {
                    link
                    alt
                    title
                }
                isAvailableInStore
            }
            categorySearchResults {
                id
                name
            }
        }
    }
`;

interface SearchResultsInterface {
    productSearchResults: ProductSearchItemInterface[];
    categorySearchResults: CategorySearchItemInterface[];
}

const getSearchResultsDataFetcher = async function (
    query: string,
    searchText: string,
    locale: string
): Promise<FetcherResponse<SearchResultsInterface>> {
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
                    query: searchText,
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

    const { errors, data } = await response.json();

    if (data !== null) {
        return {
            data: data.getSearchResults,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getSearchResultsDataFetcher;
