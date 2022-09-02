import { OrderConfirmationData } from "pages/orderConfirmation/[orderId]";
import { FetcherResponse } from "bdConnector/types";

export const getOrderConfirmationDataQuery = `
    query GetOrderConfirmationData($orderId: String!, $locale: String!, $siteId: String!) {
        getOrderConfirmationData(orderId: $orderId, locale: $locale, siteId: $siteId) {
            orderConfirmationSummary {
            total
            subtotal
            shippingTotal
            taxTotal
            storeName
            storeId
            orderItems {
                adjustedTax
                basePrice
                bonusProductLineItem
                inventoryId
                gift
                itemId
                itemText
                price
                priceAfterItemDiscount
                priceAfterOrderDiscount
                productId
                productName
                image
                quantity
                taxBasis
                tax
                taxClassId
                ingredients
                maxQty
                minQty
            }
            }
            orderConfirmationReceipt {
            phone
            orderNumber
            orderDate
            billingAddress {
                id
                firstName
                lastName
                address1
                address2
                city
                country
                state
                zip

            }
            deliveryMethod {
                requiresDate
                name
                description
                isStorePickup
                estimatedArrivalTime
            }
            orderStatus
            paymentStatus
            shippingAddress {
                id
                firstName
                lastName
                fullName
                address1
                country
                address2
                city
                state
                zip
                phone
            }
            }
        }
    }
`;

const getOrderConfirmationDataFetcher = async function (
    query: string,
    orderId: string,
    locale: string
): Promise<FetcherResponse<OrderConfirmationData>> {
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
                    orderId,
                    locale,
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

    if (errors) {
        throw new Error(errors[0].extensions.code);
    }

    return {
        data: data.getOrderConfirmationData,
        errorCode: null,
    };
};

export default getOrderConfirmationDataFetcher;
