import { FetcherResponse } from "bdConnector/types";

export const updatePasswordMutation = `
    mutation UpdateCustomerPassword($newPassword: String!, $siteId: String!, $oldPassword: String!) {
        updateCustomerPassword(newPassword: $newPassword, siteId: $siteId, oldPassword: $oldPassword) {
            status
        }
    }
`;

const updatePasswordFetcher = async function (
    query: string,
    currentPassword: string,
    newPassword: string
): Promise<
    FetcherResponse<{
        status: string;
    }>
> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;

    let updateCustomerPassowrdRes;

    try {
        updateCustomerPassowrdRes = await fetch(process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                query,
                variables: {
                    siteId,
                    oldPassword: currentPassword,
                    newPassword: newPassword,
                },
            }),
        });
    } catch (error) {
        return {
            data: null,
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await updateCustomerPassowrdRes.json();

    if (data !== null) {
        return {
            data: data.updateCustomerPassowrdRes,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default updatePasswordFetcher;
