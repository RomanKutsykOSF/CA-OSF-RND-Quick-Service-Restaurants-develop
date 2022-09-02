import { useRouter } from "next/router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { StoreLocatorDefaults } from "interfaces/storelocatorContext";
import setSelectedStoreIdFetcher, { setSelectedStoreIdMutation } from "bdConnector/storeLocator/setSelectedStore";
import { GlobalContext } from "context/global";

export const storeLocatorContextDefaults: StoreLocatorDefaults = {
    selectedStore: null,
    isChangeStorePopupVisible: false,
    setIsChangeStorePopupVisible: () => {
        return;
    },
    confirmChangeStore: () => {
        return;
    },
    handleSelectedStore: () => {
        return;
    },
    deliveryMethodId: "",
    setDeliveryMethodId: () => {
        return;
    },
    setDefaultDeliveryMethodId: () => {
        return;
    },
};

export const StoreLocatorContext = createContext<StoreLocatorDefaults>(storeLocatorContextDefaults);

const StoreLocatorContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const { basket } = useContext(GlobalContext);
    const [selectedStore, setSelectedStore] = useState(storeLocatorContextDefaults.selectedStore);
    const router = useRouter();
    const [isChangeStorePopupVisible, setIsChangeStorePopupVisible] = useState(false);
    const [changeStorePopupData, setChangeStorePopupData] = useState(null);
    const [deliveryMethodId, setDeliveryMethodId] = useState(storeLocatorContextDefaults.deliveryMethodId);
    const [defaultDeliveryMethodId, setDefaultDeliveryMethodId] = useState(null);

    useEffect(() => {
        const savedDeliveryMethodId = localStorage.getItem("deliveryMethodId");

        if (savedDeliveryMethodId) {
            setDeliveryMethodId(savedDeliveryMethodId);
        } else if (defaultDeliveryMethodId) {
            setDeliveryMethodId(defaultDeliveryMethodId);
        }

        return () => {
            setIsChangeStorePopupVisible(false);
        };
    }, [router, basket, defaultDeliveryMethodId]);

    const prepareChangeStorePopup = (store): void => {
        setChangeStorePopupData(store);
        setIsChangeStorePopupVisible(true);
    };

    const handleSelectedStore = (store): Promise<void> | void => {
        if (selectedStore === null || !basket?.productItems) return handleChangeStore(store);

        return prepareChangeStorePopup(store);
    };

    const confirmChangeStore = (): void => {
        handleChangeStore(changeStorePopupData);
    };

    const handleChangeStore = async (store): Promise<void> => {
        setSelectedStore(store);
        await setSelectedStoreIdFetcher(setSelectedStoreIdMutation, store.id, basket?.basketId);

        router.push(`/store/${store.id}`);
    };

    return (
        <StoreLocatorContext.Provider
            value={{
                selectedStore,
                setSelectedStore: (store) => {
                    setSelectedStore(store);
                },
                confirmChangeStore,
                handleSelectedStore,
                isChangeStorePopupVisible,
                setIsChangeStorePopupVisible,
                deliveryMethodId,
                setDeliveryMethodId: (id) => {
                    setDeliveryMethodId(id);
                    localStorage.setItem("deliveryMethodId", id);
                },
                setDefaultDeliveryMethodId,
            }}
        >
            {children}
        </StoreLocatorContext.Provider>
    );
};

export default StoreLocatorContextProvider;
