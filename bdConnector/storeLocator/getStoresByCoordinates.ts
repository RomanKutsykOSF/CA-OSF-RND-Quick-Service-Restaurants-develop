import { FetcherResponse } from "bdConnector/types";
import { Store } from "interfaces/storelocatorContext";

export const getStoresByCoordinatesQuery = `
        query GetStoresByCoordinates(
            $latitude: String!
            $longitude: String!
            $deliveryMethodId: String!
            $locale: String!
            $maxDistance: String!
            $siteId: String!
        ) {
            getStoresByCoordinates(
            latitude: $latitude
            longitude: $longitude
            deliveryMethodId: $deliveryMethodId
            locale: $locale
            maxDistance: $maxDistance
            siteId: $siteId
            ) {
            deliveryMethods
            phone
            latitude
            longitude
            name
            store_hours
            address1
            id
            city
            icon
            postal_code
            imgMobile
            imgDesktop
            features {
                id
                displayName
                isAvailable
            }
        }
    }
`;

const getStoresByCoordinatesFetcher = async function (
    query: string,
    getStoresQueryParams: {
        latitude: string;
        longitude: string;
        deliveryMethodId: string;
        locale: string;
        maxDistance: string;
    }
): Promise<FetcherResponse<Store[]>> {
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
                    ...getStoresQueryParams,
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
            data: data.getStoresByCoordinates,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default getStoresByCoordinatesFetcher;
