import getSelectedStoreFetcher, { getSelectedStoreQuery } from "bdConnector/storeLocator/getSelectedStore";
import getStoreByIdFetcher, { getStoreByIdQuery } from "bdConnector/storeLocator/getStoreById";
import setSelectedStoreIdFetcher, { setSelectedStoreIdMutation } from "bdConnector/storeLocator/setSelectedStore";
import { FetcherResponse } from "bdConnector/types";
import { Basket } from "interfaces/globalContext";
import { Store } from "interfaces/storelocatorContext";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";

interface useStoreQueryProps {
    mutateFn: KeyedMutator<FetcherResponse<any>>[];
    routerPath: string;
    basket: Basket;
    getSelectedStoreMutate: KeyedMutator<FetcherResponse<Store>>;
}

const useStoreQuery = ({
    mutateFn,
    routerPath,
    basket,
    getSelectedStoreMutate,
}: useStoreQueryProps): {
    modalOpen: boolean;
    handleModalConfirm: () => void;
    handleModalCancel: () => void;
    storeDataFromQuery: Store;
    isLoading: boolean;
} => {
    const [processing, setProcessing] = useState(false);
    const [storeDataFromQuery, setStoreDataFromQuery] = useState<Store>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const router = useRouter();

    const setStore = useCallback(
        async (storeId: string): Promise<void> => {
            await setSelectedStoreIdFetcher(
                setSelectedStoreIdMutation,
                storeId || (router.query.storeId as string),
                basket?.basketId
            );
        },
        [basket?.basketId, router.query.storeId]
    );

    const handleModalConfirm = useCallback(async (): Promise<void> => {
        await setStore(storeDataFromQuery?.id);

        const routerQuery = { ...router.query };
        delete routerQuery.storeId;

        getSelectedStoreMutate();

        for (const mutate of mutateFn) {
            mutate();
        }

        await router.replace(
            {
                pathname: router.pathname,
                query: routerQuery,
            },
            undefined,
            { shallow: true }
        );

        setModalOpen(false);
    }, [getSelectedStoreMutate, mutateFn, router, setStore, storeDataFromQuery?.id]);

    const handleModalCancel = async (): Promise<void> => {
        const routerQuery = { ...router.query };
        delete routerQuery?.storeId;
        delete routerQuery?.categoryId;
        delete routerQuery?.productId;
        delete routerQuery?.slug;

        getSelectedStoreMutate();

        for (const mutate of mutateFn) {
            mutate();
        }

        await router.replace({ pathname: routerPath, query: routerQuery }, undefined, { shallow: true });

        setModalOpen(false);
    };

    const { data: storeResponse, isValidating } = useSWR(getSelectedStoreQuery, getSelectedStoreFetcher, {
        revalidateOnFocus: false,
    });

    useEffect(() => {
        setProcessing(true);

        const { storeId } = router.query;
        if (storeId && typeof storeId === "string" && router.isReady) {
            if (storeResponse && storeResponse.data === null) {
                setStore(storeId);
                handleModalConfirm();
            } else if (storeResponse && storeId !== storeResponse.data?.id) {
                const getStoreData = async (storeId: string): Promise<void> => {
                    const { data } = await getStoreByIdFetcher(getStoreByIdQuery, storeId);
                    setStoreDataFromQuery(data);
                };

                getStoreData(storeId);
                setModalOpen(true);
            } else if (storeResponse && storeId === storeResponse.data?.id) {
                const routerQuery = { ...router.query };
                delete routerQuery.storeId;

                router.replace(
                    {
                        pathname: router.pathname,
                        query: routerQuery,
                    },
                    undefined,
                    { shallow: true }
                );
            }
        }

        setProcessing(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSelectedStoreMutate, router.query, storeResponse?.data?.id]);

    return {
        modalOpen,
        handleModalConfirm,
        handleModalCancel,
        storeDataFromQuery,
        isLoading: isValidating && processing,
    };
};

export default useStoreQuery;
