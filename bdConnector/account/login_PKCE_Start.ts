import * as pkceChallenge from "pkce-challenge";
import Cookies from "js-cookie";
import { FetcherResponse } from "bdConnector/types";

export const loginStartMutation = `
    mutation LoginStartMutation($siteId: String!, $codeChallenge: String!, $password: String!, $username: String!, $commerceRedirectUrl: String!) {
        loginStart(siteId: $siteId, codeChallenge: $codeChallenge, password: $password, username: $username, commerceRedirectUrl: $commerceRedirectUrl) {
            redirectURL
        }
    }
`;

const loginStartFetcher = async function (
    query: string,
    loginStartParams: {
        username: string;
        password: string;
    }
): Promise<FetcherResponse<{ redirectURL: string }>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;
    const commerceRedirectUrl = process.env.NEXT_PUBLIC_COMMERCE_API_REDIRECT_URL;
    const { code_verifier: codeVerifier, code_challenge: codeChallenge } = pkceChallenge.default(128);
    Cookies.set("session.code-verifier", codeVerifier, { expires: 60 * 1000 });

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
                    codeChallenge,
                    commerceRedirectUrl,
                    ...loginStartParams,
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
            data: data.loginStart,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default loginStartFetcher;
