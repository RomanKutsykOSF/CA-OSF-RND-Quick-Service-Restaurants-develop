import { FetcherResponse } from "bdConnector/types";
import { DateTimePickerData } from "components/checkout/dateTimePicker/DateTimePicker";
import { ShippingAddress, DeliveryMethods, SelectedStoreAddress, PaymentMethods, Address } from "interfaces/checkout";
export interface CheckoutDataInterface {
    primaryAddressData: ShippingAddress;
    savedAddresses?: ShippingAddress[];
    deliveryMethods: DeliveryMethods;
    dateTimePickerData: DateTimePickerData;
    selectedStoreAddress: SelectedStoreAddress;
    paymentMethods: PaymentMethods;
}

export const getCheckoutDataQuery = `
  query GetCheckoutData($siteId: String!, $locale: String) {
    checkoutData:getCheckoutData(siteId: $siteId, locale: $locale) {
      dateTimePickerData {
        months {
          name
          isActive
          number
          year
          days {
            isAvailable
            name
            id
            dayOfAWeek
            hours {
              isAvailable
              name
              id
              period
            }
          }
        }
        weekDaysTexts
      },
      savedAddresses {
        id
        addressName
        firstName
        lastName
        address1
        address2
        country
        city
        state
        zip
        phone
        isPrimary
      }
      paymentMethods {
        items {
          id
          name
        }
      }
      deliveryMethods {
        items {
          id
          name
          description
          price
          eta
          requiresDate
          isStorePickup
        }
      }
      status
      selectedStoreAddress {
      address1
      address2
        id
        addressName
        countryCode
        city
        stateCode
        postalCode
        isPrimary
        sameAsBilling
      }
    }
  }
`;

const getCheckoutDataFetcher = async function (
    query: string,
    locale: string,
    customAddressText: string
): Promise<FetcherResponse<CheckoutDataInterface>> {
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
        console.log(errors);
        throw new Error(errors[0].extensions.code);
    }

    const customAddress = {
        id: customAddressText,
        addressName: customAddressText,
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        country: "US",
        city: "",
        state: "",
        zip: "",
        phone: "",
        isPrimary: false,
        sameAsBilling: false,
    };

    if (data.checkoutData) {
        data.checkoutData.savedAddresses.unshift(customAddress);

        let primaryAddress = data?.checkoutData?.savedAddresses?.find((address: Address) => address.isPrimary);

        if (!primaryAddress) {
            primaryAddress = {
                id: customAddressText,
                addressName: customAddressText,
                firstName: "",
                lastName: "",
                address1: "",
                address2: "",
                country: "US",
                city: "",
                state: "",
                zip: "",
                phone: "",
                isPrimary: false,
                sameAsBilling: false,
            };
        }

        data.checkoutData.primaryAddressData = primaryAddress;

        return {
            data: data.checkoutData,
            errorCode: null,
        };
    }

    return {
        data: null,
        errorCode: null,
    };
};

export default getCheckoutDataFetcher;
