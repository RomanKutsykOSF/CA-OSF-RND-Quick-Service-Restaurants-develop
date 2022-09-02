import { FetcherResponse } from "bdConnector/types";
import { BillingAddress } from "interfaces/checkout";
import { CustomerInfo, ProductLineItem, Shipment, ShippingItem } from "interfaces/globalContext";

export const getOrderStatusQuery = `
    query GetOrderStatus($orderNo: String!, $siteId: String!, $phoneNumber: String!, $timestamp: String!) {
        getOrderStatus(orderNo: $orderNo, siteId: $siteId, phoneNumber: $phoneNumber, timestamp: $timestamp) {
        adjustedMerchandizeTotalTax
        adjustedShippingTotalTax
        storeId
        storeName
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
        channelType
        confirmationStatus
        creationDate
        createdBy
        currency
        customerInfo {
            customerId
            email
        }
        customerLocale
        exportStatus
        invoiceNo
        lastModified
        merchandizeTotalTax
        orderNo
        orderTotal
        paymentInstruments {
            amount
            paymentInstrumentId
            paymentMethodId
        }
        paymentStatus
        placeDate
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
            tax
            taxClassId
            ingredients
            taxBasis
            minQty
            maxQty
            ingredientsString
        }
        productSubTotal
        productTotal
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
            price
            name
            estimatedArrivalTime
            storePickupEnabled
            description
            }
            shippingAddress {
            id
            address1
            address2
            city
            countryCode
            lastName
            firstName
            phone
            fullName
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
        shippingStatus
        shippingTotalTax
        status
        taxation
        siteId
        taxTotal
        }
    }
`;

interface PaymentInstrument {
    paymentCard: any[];
    paymentInstrumentId: string;
    paymentMethodId: string;
    paymentTransaction: any[];
    c_stripePaymentIntentID: string;
}

export interface Order {
    adjustedMerchandizeTotalTax: number;
    adjustedShippingTotalTax: number;
    billingAddress: BillingAddress;
    channelType: string;
    confirmationStatus: string;
    createdBy: string;
    creationDate: Date;
    currency: string;
    customerInfo: CustomerInfo;
    customerLocale: string;
    exportStatus: string;
    invoiceNo: string;
    lastModified: Date;
    merchandizeTotalTax: number;
    orderNo: string;
    orderTotal: string;
    paymentInstruments: PaymentInstrument[];
    paymentStatus: string;
    placeDate: Date;
    productItems: ProductLineItem[];
    productSubTotal: string;
    productTotal: number;
    shipments: Shipment[];
    shippingItems: ShippingItem[];
    shippingStatus: string;
    shippingTotal: string;
    shippingTotalTax: number;
    siteId: string;
    status: string;
    taxation: string;
    taxTotal: string;
}

const getOrderStatusFetcher = async function (
    query: string,
    orderNo: string,
    phoneNumber: string,
    timestamp: string
): Promise<FetcherResponse<Order>> {
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
                    orderNo,
                    phoneNumber,
                    timestamp,
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
        console.log(JSON.stringify(errors));
        throw new Error(errors[0].extensions.code);
    }

    return {
        data: data.getOrderStatus,
        errorCode: null,
    };
};

export default getOrderStatusFetcher;
