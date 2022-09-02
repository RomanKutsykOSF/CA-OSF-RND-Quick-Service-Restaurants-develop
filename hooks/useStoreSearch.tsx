import { useContext, useState, useCallback, useMemo, KeyboardEvent, ChangeEvent, useEffect } from "react";

import { StoreLocatorContext } from "context/storelocator";
import { Store } from "interfaces/storelocatorContext";
import { debounce } from "utils";
import getStoresByCoordinatesFetcher, {
    getStoresByCoordinatesQuery,
} from "bdConnector/storeLocator/getStoresByCoordinates";
import { GlobalContext } from "context/global";
import { loadGoogleMapApi } from "components/Utils/LoadGoogleMapApi";
const SEARCH_MIN_CHARS_LENGTH = 3;
const DEBOUNCE_TIMEOUT = 750;
export interface UseStoreSearchProps {
    locale: string;
    deliveryMethodId: string;
    internalServerError: string;
    deniedGeolocationError: string;
    defaultStoreSearchRadius: string;
    serviceHelperRef: React.MutableRefObject<HTMLDivElement>;
}

const useStoreSearch = ({
    locale,
    deliveryMethodId,
    internalServerError,
    deniedGeolocationError,
    defaultStoreSearchRadius,
    serviceHelperRef,
}: UseStoreSearchProps): {
    fetching: boolean;
    stores: Store[];
    setStores: (stores: Store[]) => void;
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    searchText: string;
    handleKeydown: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleUseCurrentLocation: () => void;
    handlePreselectStore: () => void;
    googleScriptLoaded: boolean;
} => {
    const { showNotification } = useContext(GlobalContext);
    const [fetching, setFetching] = useState(false);
    const { setSelectedStore } = useContext(StoreLocatorContext);
    const [stores, setStores] = useState<Store[]>([]);
    const [searchText, setSearchText] = useState("");
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    const [placesApiService, setPlacesApiService] = useState<google.maps.places.PlacesService | null>(null);

    useEffect(() => {
        if (googleScriptLoaded) {
            if (!placesApiService) {
                if (serviceHelperRef.current) {
                    setPlacesApiService(new google.maps.places.PlacesService(serviceHelperRef.current));
                }
            }
        }
    }, [googleScriptLoaded, placesApiService, serviceHelperRef]);

    useEffect(() => {
        const googleMapScript = loadGoogleMapApi(
            `${process.env.NEXT_PUBLIC_GOOGLE_BASE_URL}/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        );

        if (window.google) {
            setGoogleScriptLoaded(true);
        }

        googleMapScript.addEventListener("load", function () {
            setGoogleScriptLoaded(true);
        });
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            () => {
                console.info("Geolocation is available.");
            },
            () => {
                console.info("Geolocation denied");
            },
            {
                timeout: 5000,
            }
        );
    }, []);

    const getStoresByCoordinates = useCallback(
        async (latitude: string, longitude: string, radius = defaultStoreSearchRadius): Promise<void> => {
            const { data } = await getStoresByCoordinatesFetcher(getStoresByCoordinatesQuery, {
                latitude,
                longitude,
                maxDistance: radius,
                deliveryMethodId,
                locale,
            });

            if (stores) {
                setStores(data);
                setFetching(false);
                return;
            }

            showNotification({
                type: "error",
                message: internalServerError,
                autoClose: true,
            });
        },
        [defaultStoreSearchRadius, deliveryMethodId, internalServerError, locale, showNotification, stores]
    );

    const selectStore = useCallback(
        (store: Store): void => {
            setSelectedStore(store);
        },
        [setSelectedStore]
    );

    const attemptStoreSearch = (): void => {
        setFetching(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                await getStoresByCoordinates(coords.latitude.toString(), coords.longitude.toString());
            },
            () => {
                showNotification({
                    type: "error",
                    message: deniedGeolocationError,
                    autoClose: true,
                });

                setFetching(false);
                setStores([]);
            }
        );
    };

    const preselectStore = useCallback((): void => {
        if (stores.length) selectStore(stores[0]);
    }, [stores, selectStore]);

    const debouncedSearch = useMemo(
        () =>
            debounce(async (val) => {
                setFetching(true);
                placesApiService.textSearch(
                    {
                        query: val,
                    },
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            const placeId = results[0].place_id;

                            placesApiService.getDetails(
                                {
                                    placeId,
                                    fields: ["geometry"],
                                },
                                (details, status) => {
                                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                                        setFetching(false);

                                        getStoresByCoordinates(
                                            details.geometry.location.lat().toString(),
                                            details.geometry.location.lng().toString()
                                        );
                                    } else {
                                        showNotification({
                                            type: "error",
                                            message: internalServerError,
                                            autoClose: true,
                                        });

                                        setFetching(false);
                                        setStores([]);
                                    }
                                }
                            );
                        } else {
                            showNotification({
                                type: "error",
                                message: internalServerError,
                                autoClose: true,
                            });

                            setFetching(false);
                            setStores([]);
                        }
                    }
                );
            }, DEBOUNCE_TIMEOUT),
        [getStoresByCoordinates, internalServerError, placesApiService, showNotification]
    );

    const handleSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.value.trim()) {
                setSearchText(e.target.value);

                if (e.target.value.length >= SEARCH_MIN_CHARS_LENGTH) {
                    debouncedSearch(e.target.value);
                }
            } else {
                setSearchText("");
            }
        },
        [debouncedSearch]
    );

    const handleKeydown = (e: KeyboardEvent): void => {
        e.key === "Enter" && preselectStore();
    };

    const handleUseCurrentLocation = (): void => {
        attemptStoreSearch();
    };

    const handlePreselectStore = (): void => {
        preselectStore();
    };

    return {
        fetching,
        stores,
        handleSearch,
        searchText,
        handleKeydown,
        setStores,
        handleUseCurrentLocation,
        handlePreselectStore,
        googleScriptLoaded,
    };
};

export default useStoreSearch;
