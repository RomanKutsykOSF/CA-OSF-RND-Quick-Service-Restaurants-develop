import { FetcherResponse } from "bdConnector/types";

export const getCMSContentByIdQuery = `
    query Query($locale: String!, $siteId: String!, $contentId: String!, $cmsId: String!) {
        getContentData(locale: $locale, siteId: $siteId, contentId: $contentId, cmsId: $cmsId)
    }
`;

const getCMSContentByIdFetcher = async function (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    query: any,
    cmsId: string,
    contentId: string,
    locale: string
): Promise<FetcherResponse<Record<string, unknown>>> {
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
                    cmsId,
                    siteId,
                    contentId,
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
            data: JSON.parse(data.getContentData)?.components,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions,
    };
};
export default getCMSContentByIdFetcher;
