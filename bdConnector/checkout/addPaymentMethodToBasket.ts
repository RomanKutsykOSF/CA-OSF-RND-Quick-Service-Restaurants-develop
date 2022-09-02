import { FetcherResponse } from "bdConnector/types";
import { Basket } from "interfaces/globalContext";

export const addPaymentMethodToBasketQuery = `
  mutation Mutation($paymentMethodId: String!, $siteId: String!) {
    addPaymentMethodToBasket(paymentMethodId: $paymentMethodId, siteId: $siteId) {
      adjustedMerchandizeTotalTax
      adjustedShippingTotalTax
      basketId
      billingAddress {
        id
        address1
        city
        address2
        countryCode
        firstName
        lastName
        fullName
        phone
        postalCode
        stateCode
      }
      creationDate
      paymentInstruments {
        paymentMethodId
        paymentInstrumentId
        amount
      }
      currency
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
        inventoryId
        gift
        itemId
        itemText
        price
        priceAfterItemDiscount
        productId
        priceAfterOrderDiscount
        productName
        image
        quantity
        tax
        taxBasis
        taxClassId
        ingredients
        minQty
        maxQty
        ingredientsString
      }
      orderTotal
      productTotal
      productSubTotal
      shipments {
        adjustedMerchandizeTotalTax
        adjustedShippingTotalTax
        merchandizeTotalTax
        productTotal
        productSubTotal
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
        shipmentId
        priceAfterItemDiscount
        tax
        taxRate
        taxClassId
      }
      shippingTotal
      shippingTotalTax
      taxation
      taxTotal
    }
  }
`;

const addPaymentMethodToBasketFetcher = async function (
    query: string,
    paymentMethodId: string
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
                    paymentMethodId,
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
        data: data.addPaymentMethodToBasket,
        errorCode: null,
    };
};

export default addPaymentMethodToBasketFetcher;
