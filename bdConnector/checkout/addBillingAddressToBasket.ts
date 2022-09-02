import { FetcherResponse } from "bdConnector/types";
import { ShippingAddressInput } from "interfaces/checkout";
import { Basket } from "interfaces/globalContext";

export const addBillingAddressToBasketQuery = `
  mutation AddBillingAddressToBasket($billingAddress: OrderAddressInput!, $siteId: String!) {
    addBillingAddressToBasket(billingAddress: $billingAddress, siteId: $siteId) {
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
        shippingTotalTax
        shippingStatus
        shippingTotal
        shippingMethod {
          price
          name
          id
          description
          storePickupEnabled
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
          address1
          address2
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
        taxBasis
        taxClassId
        tax
        quantity
        productId
        productName
        priceAfterOrderDiscount
        priceAfterItemDiscount
        price
        minQty
        maxQty
        itemId
        itemText
        ingredients
        inventoryId
        gift
        image
        bonusProductLineItem
        basePrice
        adjustedTax
      }
      paymentInstruments {
        paymentMethodId
        paymentInstrumentId
        amount
      }
      orderTotal
      merchandizeTotalTax
      lastModified
      customerInfo {
        email
        customerId
      }
      currency
      billingAddress {
        stateCode
        postalCode
        phone
        lastName
        id
        firstName
        fullName
        city
        countryCode
        address2
        address1
      }
      creationDate
      basketId
      adjustedShippingTotalTax
      adjustedMerchandizeTotalTax
    }
  }
`;

const addBillingAddressToBasketFetcher = async function (
    query: string,
    billingAddress: ShippingAddressInput
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
                    billingAddress,
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
        data: data.addBillingAddressToBasket,
        errorCode: null,
    };
};

export default addBillingAddressToBasketFetcher;
