import { FetcherResponse } from "bdConnector/types";
import { Address } from "interfaces/checkout";

export const addAddressMutation = `
    mutation AddNewAddress($address: AddressInput!, $siteId: String!) {
        addNewAddress(address: $address, siteId: $siteId) {
            id
            addressName
            firstName
            address1
            address2
            lastName
            country
            city
            state
            zip
            phone
            isPrimary
        }
    }
`;

const addAddressFetcher = async function (query: string, address: Address): Promise<FetcherResponse<Address>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;

    let addressResponse;

    try {
        addressResponse = await fetch(process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                query,
                variables: {
                    siteId,
                    address,
                },
            }),
        });
    } catch (error) {
        return {
            data: null,
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await addressResponse.json();

    if (data !== null) {
        return {
            data: data.addNewAddress,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default addAddressFetcher;
