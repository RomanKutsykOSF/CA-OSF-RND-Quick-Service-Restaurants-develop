import { FetcherResponse } from "bdConnector/types";
import { Basket } from "interfaces/globalContext";

export const addToCartMutation = `
    mutation Mutation($ingredients: String!, $locale: String!, $siteId: String!, $quantity: Float!, $productId: String!, $minOrderQty: Float, $maxOrderQty: Float) {
        addToBasket(ingredients: $ingredients, locale: $locale, siteId: $siteId, quantity: $quantity, productId: $productId, minOrderQty: $minOrderQty, maxOrderQty: $maxOrderQty) {
        adjustedMerchandizeTotalTax
        basketId
        adjustedShippingTotalTax
        billingAddress {
            address1
            id
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
        paymentInstruments {
            amount
            paymentInstrumentId
            paymentMethodId
        }
        currency
        creationDate
        customerInfo {
            customerId
            email
        }
        lastModified
        merchandizeTotalTax
        productItems {
            adjustedTax
            basePrice
            bonusProductLineItem
            gift
            inventoryId
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
            ingredients
            taxClassId
            maxQty
            minQty
            ingredientsString
        }
        orderTotal
        productSubTotal
        productTotal
        shipments {
            adjustedMerchandizeTotalTax
            adjustedShippingTotalTax
            merchandizeTotalTax
            productSubTotal
            productTotal
            shipmentId
            shipmentTotal
            shippingMethod {
            id
            name
            price
            estimatedArrivalTime
            storePickupEnabled
            description
            }
            shippingAddress {
            id
            address1
            address2
            city
            firstName
            countryCode
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
        taxation
        shippingTotalTax
        taxTotal
        }
    }
`;

const addToCartFetcher = async function (
    query: string,
    locale: string,
    productId: string,
    quantity: number,
    ingredients?: string,
    minOrderQty?: number,
    maxOrderQty?: number
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
                    locale,
                    siteId,
                    quantity,
                    productId,
                    ingredients,
                    minOrderQty,
                    maxOrderQty,
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
            data: data.addToBasket,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: errors[0].extensions.code,
    };
};

export default addToCartFetcher;
