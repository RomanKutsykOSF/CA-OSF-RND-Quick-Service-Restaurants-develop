export interface Address {
    id?: string;
    addressName?: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    fullName?: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    isPrimary?: boolean;
}

export interface ShippingAddressInput {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    countryCode: string;
    city: string;
    stateCode: string;
    phone: string;
    postalCode: string;
    addressName?: string;
}

export interface SelectedStoreAddress {
    id?: string;
    addressName?: string;
    address1: string;
    address2?: string;
    countryCode: string;
    city: string;
    stateCode: string;
    postalCode: string;
    isPrimary?: boolean;
}

export interface ShippingAddress extends Address {
    sameAsBilling?: boolean;
}

export type BillingAddress = Address;

export interface DeliveryMethod {
    description: string;
    id: string;
    name: string;
    eta?: string;
    requiresDate?: boolean;
    price: string;
    isStorePickup: boolean;
}

export interface DeliveryMethods {
    items: DeliveryMethod[];
}

interface PaymentMethod {
    id: string;
    name: string;
}

export interface PaymentMethods {
    items: PaymentMethod[];
}
export interface OrderConfirmationReceipt {
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
    orderDate: string;
    deliveryMethod: {
        requiresDate: boolean;
        name: string;
        description: string;
        isStorePickup: boolean;
        estimatedArrivalTime: string;
    };
    deliveryDate: string;
    scheduledDeliveryTime: string;
    shippingAddress: ShippingAddress;
    billingAddress: BillingAddress;
    phone: string;
}
