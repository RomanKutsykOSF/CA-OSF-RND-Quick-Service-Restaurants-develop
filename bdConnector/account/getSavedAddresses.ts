import { Address } from "interfaces/checkout";
import { FetcherResponse } from "bdConnector/types";

export const getAddressDataQuery = `
    query getAddressData($siteId: String!) {
         getSavedAddresses(siteId: $siteId) {
            id
            addressName
            firstName
            lastName
            address1
            address2
            country
            city
            state
            zip
            phone
            isPrimary
        }
    }
`;

const getAddressDataFetcher = async function (query: string): Promise<FetcherResponse<Address[]>> {
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
            data: data.getSavedAddresses,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getAddressDataFetcher;
