import { FetcherResponse } from "bdConnector/types";
import { OrderDataInterface } from "components/UI/OrdersAccordionItem";

export const getUserOrdersQuery = `
    query Query($siteId: String!) {
        getCustomerOrders(siteId: $siteId) {
            total
            orders {
                paymentStatus
                total
                status
                date
                orderNumber
                storeId
                storeName
                billingAddress {
                    id
                    firstName
                    lastName
                    fullName
                    address1
                    address2
                    country
                    state
                    city
                    zip
                    phone
                }
                subtotal
                shippingTotal
                taxTotal
                shipments {
                    shippingStatus
                    id
                    deliveryMethod {
                        name
                        description
                        requiresDate
                        isStorePickup
                    }
                    shippingAddress {
                        id
                        address1
                        address2
                        city
                        countryCode
                        firstName
                        lastName
                        fullName
                        phone
                        postalCode
                        stateCode
                    }
                    items {
                        basePrice
                        adjustedTax
                        bonusProductLineItem
                        gift
                        inventoryId
                        itemText
                        itemId
                        price
                        priceAfterItemDiscount
                        priceAfterOrderDiscount
                        productName
                        productId
                        image
                        quantity
                        tax
                        taxBasis
                        taxClassId
                        ingredients
                        maxQty
                        minQty
                        ingredientsString
                    }
                }
            }
        }
    }
`;

const getUserOrdersFetcher = async function (query: string): Promise<FetcherResponse<OrderDataInterface[]>> {
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
        data: data.getCustomerOrders.orders,
        errorCode: null,
    };
};

export default getUserOrdersFetcher;
