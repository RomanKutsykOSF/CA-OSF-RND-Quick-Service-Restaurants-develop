import { FetcherResponse } from "bdConnector/types";

export const createOrderQuery = `
    mutation Mutation($storeId: String!, $siteId: String!) {
        createOrder(storeId: $storeId, siteId: $siteId) {
            status
            orderNo
        }
    }
`;

interface createOrderInterface {
    status: string;
    orderNo: string;
}

const createOrderFetcher = async function (
    query: string,
    storeId: string
): Promise<FetcherResponse<createOrderInterface>> {
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
                    storeId,
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

    if (errors) {
        throw new Error(errors[0].extensions.code);
    }

    return {
        data: data.createOrder,
        errorCode: null,
    };
};

export default createOrderFetcher;
