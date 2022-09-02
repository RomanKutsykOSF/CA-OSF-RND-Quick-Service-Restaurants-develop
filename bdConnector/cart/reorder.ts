import { FetcherResponse } from "bdConnector/types";
import { Basket } from "interfaces/globalContext";

export const reorderQuery = `
    mutation Mutation($orderNo: String!, $locale: String!, $siteId: String!) {
        reorder(orderNo: $orderNo, locale: $locale, siteId: $siteId) {
        productTotal
        shipments {
            shipmentId
            productTotal
            shippingMethod {
            description
            storePickupEnabled
            estimatedArrivalTime
            id
            name
            price
            }
        }
        adjustedMerchandizeTotalTax
        adjustedShippingTotalTax
        basketId
        billingAddress {
            phone
            address2
            id
            address1
            firstName
            city
            countryCode
            lastName
            fullName
            postalCode
            stateCode
        }
        creationDate
        paymentInstruments {
            amount
            paymentInstrumentId
            paymentMethodId
        }
        currency
        customerInfo {
            customerId
            email
        }
        orderTotal
        lastModified
        merchandizeTotalTax
        productItems {
            image
            productName
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
            taxBasis
            taxClassId
            ingredients
            quantity
            tax
            maxQty
            minQty
            ingredientsString
        }
        productSubTotal
        shippingItems {
            basePrice
            adjustedTax
            itemId
            itemText
            price
            priceAfterItemDiscount
            shipmentId
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

const reorderFetcher = async function (
    query: string,
    locale: string,
    orderNo: string
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
                    orderNo,
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
        if (data.reorder !== null) {
            return {
                data: data.reorder,
                errorCode: null,
            };
        }

        return {
            data: null,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default reorderFetcher;
