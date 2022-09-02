import { UserProfileInterface } from "pages/account/profile";
import { FetcherResponse } from "bdConnector/types";

export const getProfileDataQuery = `
   query Query($siteId: String!) {
        getProfileData(siteId: $siteId) {
            firstName
            lastName
            phone
            email
            numberOfOrders
            lastOrderDate
        }
    }
`;

const getProfileDataFetcher = async function (query: string): Promise<FetcherResponse<UserProfileInterface>> {
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
            errorCode: "NetworkError when attempting to fetch resource",
        };
    }

    const { errors, data } = await response.json();

    if (data !== null) {
        return {
            data: data.getProfileData,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getProfileDataFetcher;
