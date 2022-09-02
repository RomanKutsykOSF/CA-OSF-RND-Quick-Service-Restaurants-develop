import { FetcherResponse } from "bdConnector/types";
import { GlobalUserData } from "interfaces/globalContext";

export const loginEndMutation = `
    mutation LoginEndMutation($usid: String!, $codeVerifier: String!, $code: String!, $siteId: String!, $commerceRedirectUrl: String!) {
        loginEnd(usid: $usid, codeVerifier: $codeVerifier, code: $code, siteId: $siteId, commerceRedirectUrl: $commerceRedirectUrl) {
            isLoggedIn
            firstName
            lastName
        }
    }
`;

const loginEndFetcher = async function (
    query: string,
    loginEndProps: {
        code: string;
        codeVerifier: string;
        usid: string;
    }
): Promise<FetcherResponse<GlobalUserData>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;
    const commerceRedirectUrl = process.env.NEXT_PUBLIC_COMMERCE_API_REDIRECT_URL;

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
                    ...loginEndProps,
                    siteId,
                    commerceRedirectUrl,
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
            data: data.loginEnd,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default loginEndFetcher;
