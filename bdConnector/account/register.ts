import { FetcherResponse } from "bdConnector/types";

export const registerMutation = `
    mutation Register($siteId: String!, $customer: Customer!, $password: String!) {
        register(siteId: $siteId, customer: $customer, password: $password) {
        email  
        }
    }
`;

const registerFetcher = async (
    query: string,
    {
        customer,
        password,
    }: {
        customer: { firstName: string; lastName: string; email: string; phoneMobile: string };
        password: string;
    }
): Promise<FetcherResponse<{ email: string }>> => {
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
                    customer: { ...customer, login: customer.email },
                    password,
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
            data: data.register,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default registerFetcher;
