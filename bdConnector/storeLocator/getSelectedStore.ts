import { FetcherResponse } from "bdConnector/types";
import { Store } from "interfaces/storelocatorContext";

export const getSelectedStoreQuery = `
    query Query($siteId: String!) {
        getSelectedStore(siteId: $siteId) {
        deliveryMethods
        phone
        latitude
        address1
        name
        longitude
        store_hours
        id
        city
        imgMobile
        icon
        postal_code
        imgDesktop
        }
    }
`;

const getSelectedStoreFetcher = async (query: string): Promise<FetcherResponse<Store>> => {
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
            data: data.getSelectedStore,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getSelectedStoreFetcher;
