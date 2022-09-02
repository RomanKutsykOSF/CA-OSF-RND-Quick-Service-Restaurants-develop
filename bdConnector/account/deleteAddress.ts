import { FetcherResponse } from "bdConnector/types";

export const deleteAddressMutation = `
    mutation Mutation($siteId: String!, $addressId: String!) {
        deleteAddress(siteId: $siteId, addressId: $addressId) {
            status
        }
    }
`;

const deleteAddressFetcher = async function (query: string, addressId: string): Promise<FetcherResponse<string>> {
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
                    addressId,
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
            data: data.deleteAddress,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default deleteAddressFetcher;
