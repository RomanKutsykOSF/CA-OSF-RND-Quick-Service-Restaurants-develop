import { MenuLink } from "components/UI/header/Navigation/Navigation";
import { FooterColumn, FooterIcon } from "components/UI/footer/Footer";
import { NotificationProps } from "components/UI/Notification";
import { KeyedMutator } from "swr";
import { FetcherResponse } from "bdConnector/types";
import { BillingAddress, ShippingAddress } from "./checkout";
import { Store } from "./storelocatorContext";

export interface ViewportsInterface {
    xSmall: number;
    small: number;
    medium: number;
    large: number;
    xlarge: number;
    xxlarge: number;
}

interface colors {
    "--t-primary": string;
    "--t-secondary": string;
    "--t-tertiary": string;
    "--t-faded": string;
    "--t-disabled": string;
    "--t-success": string;
    "--t-error": string;
    "--bgr-primary": string;
    "--bgr-secondary": string;
    "--bgr-tertiary": string;
    "--bgr-faded": string;
    "--bgr-error": string;
    "--bgr-disabled": string;
    "--br-primary": string;
    "--br-secondary": string;
}

interface fontfamilies {
    "--font-family-primary": string;
}

interface typography {
    "--animation-duration-default": string;
}

export interface ThemeCssVariables {
    colors: colors;
    fontfamilies: fontfamilies;
    typography: typography;
}

interface ProductLineItemIngredientPrice {
    displayValue: string;
    value: number;
}

interface ProductLineItemIngredient {
    id: string;
    name: string;
    imgUrl: string;
    initialQty: number;
    max: number;
    min: number;
    price: ProductLineItemIngredientPrice;
    qty: number;
}

export interface ProductLineItem {
    itemId: string;
    productId: string;
    productName: string;
    image?: string;
    ingredients?: ProductLineItemIngredient[];
    ingredientsString?: string;
    price: string;
    size?: string;
    minQty?: number;
    maxQty?: number;
    quantity: number;
}

export interface Shipment {
    adjustedMerchandizeTotalTax: number;
    adjustedShippingTotalTax: number;
    gift: boolean;
    merchandizeTotalTax: number;
    productSubTotal: number;
    productTotal: number;
    shipmentId: string;
    shipmentTotal: number;
    shippingAddress: ShippingAddress;
    shippingMethod: ShippingMethod;
    shippingStatus: string;
    shippingTotal: number;
    shippingTotalTax: number;
    taxTotal: number;
}

export interface ShippingMethod {
    description: string;
    id: string;
    name: string;
    price: number;
    estimatedArrivalTime: string;
    requiresDate: boolean;
    storePickupEnabled: boolean;
}

export interface ShippingItem {
    adjustedTax: number;
    basePrice: number;
    itemId: string;
    itemText: string;
    price: number;
    priceAfterItemDiscount: number;
    shipmentId: string;
    tax: number;
    taxBasis: number;
    taxClassId: string;
    taxRate: number;
}

export interface CustomerInfo {
    customerId: string;
    email?: string;
}

interface PaymentInstrument {
    amount: number;
    paymentInstrumentId: string;
    paymentMethodId: string;
}
export interface Basket {
    adjustedMerchandizeTotalTax: number;
    adjustedShippingTotalTax: number;
    agentBasket: boolean;
    basketId: string;
    billingAddress: BillingAddress;
    channelType: string;
    creationDate: Date;
    currency: string;
    customerInfo: CustomerInfo;
    lastModified: Date;
    merchandizeTotalTax: number;
    orderTotal: string;
    productItems: ProductLineItem[];
    productSubTotal: string;
    productTotal: number;
    shipments: Shipment[];
    shippingItems: ShippingItem[];
    shippingTotal: string;
    shippingTotalTax: number;
    taxation: string;
    taxTotal: string;
    paymentInstruments?: PaymentInstrument[];
}

export interface GlobalUserData {
    firstName?: string;
    lastName?: string;
    isLoggedIn: boolean;
}

export interface GlobalData {
    sitePreferences: {
        siteLogo: string;
        isWishlistEnabled: boolean;
    };
    navigationData: {
        links: MenuLink[];
        noStoreSelectedLinks: MenuLink[];
    };
    footerData: {
        columns: FooterColumn[];
        icons: FooterIcon[];
        copyright: string;
        logo: string;
    };
    storelocatorConfigs: {
        addressDeliveryMethodId: string;
        defaultDeliveryMethodId: string;
        defaultLatitude: string;
        defaultLongitude: string;
        defaultStoreSearchRadius: string;
        pickUpInStoreMethodId: string;
        storeSearchRadius: string;
    };
}

export interface ProductSearchItemInterface {
    id: string;
    name: string;
    image: {
        link: string;
        alt: string;
        title: string;
    };
    size?: string;
    price: string;
    link?: string;
    isAvailableInStore: boolean;
}

export interface CategorySearchItemInterface {
    id: string;
    name: string;
    link?: string;
}
export interface GlobalContextDefaults {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: (isLoggedIn: boolean) => any;
    viewports: ViewportsInterface;
    themeCssVariables: ThemeCssVariables;
    themeCssString: string;
    pageTransitionLoader: boolean;
    setPageTransitionLoader: (state: boolean) => void;
    screenBlockLoader: boolean;
    setScreenBlockLoader: (state: boolean) => void;
    setThemeVariables: (themeVariablesJSON: ThemeCssVariables) => any;
    basket: Basket;
    setBasket: (basket: Basket) => void;
    isMinicartExpanded: boolean;
    setMinicartExpanded: (isExpanded: boolean) => any;
    isSearchExpanded: boolean;
    categorySearchResults: CategorySearchItemInterface[];
    productSearchResults: ProductSearchItemInterface[];
    searchFunction: (searchText: string, selectedStoreId: string, locale: string) => void;
    setIsSearchExpanded: (state: boolean) => void;
    showNotification: ({ type, message, autoClose }: NotificationProps) => void;
    closeNotification: () => void;
    activeNotification: NotificationProps;
    isFetchingSearchResults: boolean;
    useSwrGetCartMutate: KeyedMutator<FetcherResponse<Basket>>;
    setUseSwrGetCartMutate: (mutatorFn: KeyedMutator<FetcherResponse<Basket>>) => void;
    useSwrGetUserDataMutate: KeyedMutator<FetcherResponse<GlobalUserData>>;
    setUseSwrGetUserDataMutate: (mutatorFn: KeyedMutator<FetcherResponse<GlobalUserData>>) => void;
    getSelectedStoreMutate: KeyedMutator<FetcherResponse<Store>>;
    setGetSelectedStoreMutate: (mutatorFn: KeyedMutator<FetcherResponse<Store>>) => void;
    cartValidating: boolean;
    setCartValidating: (state: boolean) => void;
}
