import { FetcherResponse } from "bdConnector/types";
import { GlobalUserData } from "interfaces/globalContext";

export const getGlobalUserDataQuery = `
    query getGlobalUserDataQuery($siteId: String!) {
        getGlobalUserData(siteId: $siteId) {
            firstName
            lastName
            isLoggedIn
        }
    }
`;

const getGlobalUserDataFetcher = async function (query: string): Promise<FetcherResponse<GlobalUserData>> {
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
            data: data.getGlobalUserData,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getGlobalUserDataFetcher;
