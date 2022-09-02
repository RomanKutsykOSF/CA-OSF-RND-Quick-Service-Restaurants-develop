import { FetcherResponse } from "bdConnector/types";

export const updateProfileDataQuery = `
    mutation UpdateCustomerProfileData($phone: String!, $email: String!, $firstName: String!, $lastName: String!, $siteId: String!) {
        updateCustomerProfileData(phone: $phone, email: $email, firstName: $firstName, lastName: $lastName, siteId: $siteId) {
            isEmailChanged
        }
    }
`;

interface userProfileDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

const updateProfileDataFetcher = async function (
    query: string,
    userProfileDTO: userProfileDTO
): Promise<FetcherResponse<{ isEmailChanged: boolean }>> {
    const siteId = process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID;

    let updateProfileRes;

    try {
        updateProfileRes = await fetch(process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                query,
                variables: {
                    siteId,
                    ...userProfileDTO,
                },
            }),
        });
    } catch (error) {
        return {
            data: null,
            errorCode: "INTERNAL_SERVER_ERROR",
        };
    }

    const { errors, data } = await updateProfileRes.json();

    if (data !== null) {
        return {
            data: data.updateCustomerProfileData,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default updateProfileDataFetcher;
