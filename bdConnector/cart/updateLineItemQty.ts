import { FetcherResponse } from "bdConnector/types";
import { Basket } from "interfaces/globalContext";

export const updateLineItemQtyMutation = `
    mutation Mutation($basketId: String!, $locale: String!, $siteId: String!, $quantity: Float!, $itemId: String!) {
        updateItemInBasket(basketId: $basketId, locale: $locale, siteId: $siteId, quantity: $quantity, itemId: $itemId) {
        adjustedMerchandizeTotalTax
        adjustedShippingTotalTax
        basketId
        billingAddress {
            postalCode
            phone
            fullName
            firstName
            lastName
            countryCode
            address2
            city
            address1
            id
            stateCode
        }
        paymentInstruments {
            paymentMethodId
            amount
            paymentInstrumentId
        }
        creationDate
        currency
        customerInfo {
            customerId
            email
        }
        lastModified
        merchandizeTotalTax
        orderTotal
        productItems {
            adjustedTax
            bonusProductLineItem
            basePrice
            inventoryId
            gift
            itemId
            itemText
            price
            priceAfterItemDiscount
            priceAfterOrderDiscount
            productId
            productName
            quantity
            image
            taxClassId
            tax
            taxBasis
            ingredients
            maxQty
            minQty
            ingredientsString
        }
        productSubTotal
        productTotal
        shipments {
            adjustedMerchandizeTotalTax
            adjustedShippingTotalTax
            merchandizeTotalTax
            productSubTotal
            productTotal
            shipmentId
            shippingMethod {
            id
            name
            price
            estimatedArrivalTime
            storePickupEnabled
            description
            }
            shipmentTotal
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
            shippingStatus
            shippingTotal
            shippingTotalTax
            taxTotal
        }
        shippingItems {
            adjustedTax
            basePrice
            itemText
            itemId
            price
            shipmentId
            priceAfterItemDiscount
            tax
            taxClassId
            taxRate
        }
        shippingTotal
        shippingTotalTax
        taxation
        taxTotal
        }
    }
`;

const updateLineItemQty = async function (
    query: string,
    lineItemId: string,
    newQty: number,
    locale: string,
    basketId: string
): Promise<FetcherResponse<Basket>> {
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
                    locale,
                    itemId: lineItemId,
                    quantity: newQty,
                    basketId,
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
            data: data.updateItemInBasket,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default updateLineItemQty;
