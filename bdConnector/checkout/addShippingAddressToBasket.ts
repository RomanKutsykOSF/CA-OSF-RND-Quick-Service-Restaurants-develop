import { FetcherResponse } from "bdConnector/types";
import { ShippingAddressInput } from "interfaces/checkout";
import { Basket } from "interfaces/globalContext";

export const addShippingAddressToBasketQuery = `
  mutation AddShippingAddressToBasket($shippingAddress: OrderAddressInput!, $siteId: String!) {
    addShippingAddressToBasket(shippingAddress: $shippingAddress, siteId: $siteId) {
      taxTotal
      taxation
      shippingTotalTax
      shippingTotal
      shippingItems {
        taxRate
        taxClassId
        tax
        shipmentId
        price
        priceAfterItemDiscount
        itemText
        itemId
        basePrice
        adjustedTax
      }
      shipments {
        taxTotal
        shippingTotalTax
        shippingTotal
        shippingStatus
        shippingMethod {
          storePickupEnabled
          id
          description
          name
          price
          estimatedArrivalTime
        }
        shipmentTotal
        shippingAddress {
          stateCode
          postalCode
          phone
          lastName
          id
          firstName
          fullName
          countryCode
          address2
          city
          address1
        }
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
        tax
        productName
        quantity
        productId
        priceAfterOrderDiscount
        priceAfterItemDiscount
        minQty
        price
        maxQty
        itemText
        itemId
        inventoryId
        image
        ingredients
        gift
        bonusProductLineItem
        basePrice
        adjustedTax
      }
      paymentInstruments {
        paymentMethodId
        paymentInstrumentId
        amount
      }
      merchandizeTotalTax
      orderTotal
      lastModified
      currency
      customerInfo {
        customerId
        email
      }
      creationDate
      basketId
      billingAddress {
        postalCode
        stateCode
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
      adjustedShippingTotalTax
      adjustedMerchandizeTotalTax
    }
  }
`;

const addShippingAddressToBasketFetcher = async function (
    query: string,
    shippingAddress: ShippingAddressInput
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
                    shippingAddress,
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
        data: data.addShippingAddressToBasket,
        errorCode: null,
    };
};

export default addShippingAddressToBasketFetcher;
