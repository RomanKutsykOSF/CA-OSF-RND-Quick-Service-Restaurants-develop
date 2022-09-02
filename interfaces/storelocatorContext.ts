type feature = {
    id: string;
    displayName: string;
    isAvailable: boolean;
};

export interface Store {
    phone?: string;
    latitude: number;
    longitude: number;
    address1: string;
    name: string;
    store_hours: string;
    id: string;
    city?: string;
    icon?: string;
    postal_code: number;
    imgMobile?: string;
    imgDesktop?: string;
    features: feature[];
}

export interface StoreLocatorDefaults {
    selectedStore: Store;
    setSelectedStore?: (store: Store) => void;
    confirmChangeStore: () => any;
    handleSelectedStore: (selectedStore: Store) => void;
    isChangeStorePopupVisible: boolean;
    setIsChangeStorePopupVisible: (state: boolean) => void;
    deliveryMethodId: string;
    setDeliveryMethodId: (deliveryMethodId: string) => void;
    setDefaultDeliveryMethodId: (deliveryMethodId: string) => void;
}
