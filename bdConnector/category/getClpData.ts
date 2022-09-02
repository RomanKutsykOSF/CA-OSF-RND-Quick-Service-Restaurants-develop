import { FetcherResponse } from "bdConnector/types";
import { ClpData } from "pages/store/[categoryId]";

export const getCLPDataQuery = `
    query GetCLPData($siteId: String!, $locale: String!, $categoryId: String!) {
        getCLPData(siteId: $siteId, locale: $locale, categoryId: $categoryId) {
        isClpEnabled
        imgDesktop
        imgMobile
        subCategories {
            categoryLogo
            parentCategoryId
            name
            id
        }
        popularProducts {
            name
            description
            id
            weight
            price
            imgUrl
            isAvailableInStore
        }
        }
    }
`;

const getCLPDataFetcher = async function (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    query: any,
    categoryId: string,
    locale: string
): Promise<FetcherResponse<ClpData>> {
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
                    categoryId,
                },
            }),
        });
    } catch (error) {
        return {
            data: { isClpEnabled: false, subCategories: [], popularProducts: [], imgDesktop: null, imgMobile: null },
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await response.json();

    if (data !== null) {
        return {
            data: {
                imgDesktop: data.getCLPData.imgDesktop,
                imgMobile: data.getCLPData.imgMobile,
                isClpEnabled: data.getCLPData.isClpEnabled,
                subCategories: data.getCLPData.subCategories,
                popularProducts: data.getCLPData.popularProducts,
            },
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};
export default getCLPDataFetcher;
