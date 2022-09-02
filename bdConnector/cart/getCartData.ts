import { FetcherResponse } from "bdConnector/types";
import { Basket } from "interfaces/globalContext";

export const getCartQuery = `
  query GetCustomerBaskets($siteId: String!) {
      getCustomerBaskets(siteId: $siteId) {
        orderTotal
        adjustedShippingTotalTax
        adjustedMerchandizeTotalTax
        basketId
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
          basePrice
          bonusProductLineItem
          gift
          inventoryId
          itemId
          priceAfterOrderDiscount
          price
          image
          itemText
          priceAfterItemDiscount
          productId
          productName
          quantity
          tax
          taxClassId
          taxBasis
          ingredients
          maxQty
          minQty
          ingredientsString
        }
        productSubTotal
        productTotal
        shipments {
          shippingMethod {
            estimatedArrivalTime
            storePickupEnabled
            description
            id
            name
            price
          }
          shippingAddress {
            address1
            address2
            city
            countryCode
            firstName
            fullName
            id
            lastName
            phone
            postalCode
            stateCode
          }
          adjustedMerchandizeTotalTax
          adjustedShippingTotalTax
          merchandizeTotalTax
          productSubTotal
          productTotal
          shipmentId
          shipmentTotal
          shippingStatus
          shippingTotal
          shippingTotalTax
          taxTotal
        }
        paymentInstruments {
          paymentInstrumentId
          paymentMethodId
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
        billingAddress {
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
        shippingTotal
        shippingTotalTax
        taxation
        taxTotal
      }
    }
`;

const getCartDataFetcher = async function (query: string): Promise<FetcherResponse<Basket>> {
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

    if (data !== null) {
        if (data.getCustomerBaskets !== null) {
            return {
                data: data.getCustomerBaskets,
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

export default getCartDataFetcher;
