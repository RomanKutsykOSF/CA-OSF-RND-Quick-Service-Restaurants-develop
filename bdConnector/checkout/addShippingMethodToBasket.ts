import { FetcherResponse } from "bdConnector/types";

export const addShippingMethodToBasketQuery = `
  mutation Mutation($shippingMethodId: String!, $siteId: String!) {
    addShippingMethodToBasket(shippingMethodId: $shippingMethodId, siteId: $siteId) {
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
      paymentInstruments {
        paymentMethodId
        paymentInstrumentId
        amount
      }
      taxation
      taxTotal
      shippingTotalTax
      shippingTotal
      shippingItems {
        taxRate
        taxClassId
        tax
        shipmentId
        priceAfterItemDiscount
        price
        itemText
        itemId
        basePrice
        adjustedTax
      }
      shipments {
        taxTotal
        shippingTotal
        shippingTotalTax
        shippingStatus
        shippingMethod {
          storePickupEnabled
          description
          id
          name
          price
          estimatedArrivalTime
        }
        shippingAddress {
          stateCode
          postalCode
          phone
          lastName
          id
          fullName
          firstName
          countryCode
          city
          address2
          address1
        }
        shipmentTotal
        shipmentId
        productTotal
        productSubTotal
        merchandizeTotalTax
        adjustedShippingTotalTax
        adjustedMerchandizeTotalTax
      }
      productTotal
      productSubTotal
      productItems {
        taxClassId
        taxBasis
        quantity
        productId
        tax
        productName
        priceAfterOrderDiscount
        priceAfterItemDiscount
        price
        minQty
        itemText
        maxQty
        inventoryId
        itemId
        image
        ingredients
        gift
        bonusProductLineItem
        basePrice
        adjustedTax
      }
      orderTotal
      lastModified
      merchandizeTotalTax
      customerInfo {
        email
        customerId
      }
      currency
      creationDate
    }
  }
`;

const addShippingMethodToBasketFetcher = async function (
    query: string,
    shippingMethodId: string
): Promise<FetcherResponse<any>> {
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
                    shippingMethodId,
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
        data: data.addShippingMethodToBasket,
        errorCode: null,
    };
};

export default addShippingMethodToBasketFetcher;
