import React, { useState, useContext, useEffect, useCallback } from "react";
import { GetStaticPropsContext, GetStaticPropsResult, GetStaticPaths } from "next";
import MainLayout from "components/layouts/main";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import ProductBanner from "components/pdp/ProductBanner";
import SizeTiles from "components/pdp/SizeTiles";
import IngredientsSelector from "components/pdp/IngredientsSelector";
import Tabs from "components/UI/Tabs";
import ButtonSaveForLater from "components/UI/ButtonSaveForLater";
import { GlobalContext } from "context/global";
import i18nInit from "i18";
import slugify from "slugify";
import AddToCart from "components/pdp/AddToCart";
import { ProductProps } from "interfaces/pdp";
import populateGlobalResources from "i18/populateGlobalResources";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import getProductDataFetcher, { getProductDataQuery } from "bdConnector/product/getProductData";
import getProductPriceFetcher, { getProductPriceQuery } from "bdConnector/product/getProductPrice";
import useSWR from "swr";
import { FetcherResponse } from "bdConnector/types";
import addToCartFetcher, { addToCartMutation } from "bdConnector/product/addProductToCart";
import Modal from "components/UI/ModalPopup";
import { useRouter } from "next/router";
import { i18n } from "i18next";
import getIsrPreRenderedPdpsFetcher, { getIsrPreRenderedPdpsQuery } from "bdConnector/product/getIsrPreRenderedPdps";
import addProductToWishListHandler, { addProductToWishListMutation } from "bdConnector/product/addProductToWishList";
import revalidatePagesConfig from "../../../../config/revalidatePagesConfig.json";
import Head from "next/head";
import useStoreQuery from "hooks/useStoreQuery";
import { StoreLocatorContext } from "context/storelocator";

interface PdpProps {
    i18: any;
    locale: string;
    globalData: FetcherResponse<GlobalData>;
    product: ProductProps;
    globalResources: Record<string, string>;
}

const Pdp = ({ locale, i18, globalData, product, globalResources }: PdpProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const { selectedStore } = useContext(StoreLocatorContext);
    const [ingredientsOutput, setIngredientsOutput] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [modal, setModal] = useState<{ isVisible: boolean; message?: string; title?: string }>({
        isVisible: false,
        message: "",
        title: "",
    });
    const [productQuantity, setProductQuantity] = useState(1);
    const [productIngredientGroups, setProductIngredientGroups] = useState([]);
    const [i18Fd, setI18Fd] = useState(null);
    const router = useRouter();

    useEffect(() => {
        i18nInit(locale)
            .then((i18Fd) => {
                setI18Fd(i18Fd);
            })
            .catch((e) => {
                console.log("Error during pdp i18Fd initialization:", e);
            });
    }, [locale]);

    const {
        data: { data: productData },
        isValidating: productDataValidating,
        mutate: swrProductDataMutate,
    } = useSWR([getProductDataQuery, product.id, locale], getProductDataFetcher, {
        fallbackData: { data: product },
        onError: () => {
            router.replace("/500");
        },
    });

    const { data: productPriceData, isValidating: isLoadingPrice, mutate: productPriceMutate } = useSWR(
        [getProductPriceQuery, productData.id, productQuantity, JSON.stringify(ingredientsOutput), locale],
        getProductPriceFetcher
    );

    const { handleModalCancel, handleModalConfirm, modalOpen, storeDataFromQuery, isLoading } = useStoreQuery({
        mutateFn: [productPriceMutate, swrProductDataMutate],
        routerPath: `/product/${product.id}/${slugify(product.name)}`,
        basket: globalContext?.basket,
        getSelectedStoreMutate: globalContext?.getSelectedStoreMutate,
    });

    useEffect(() => {
        setProductIngredientGroups(productData.ingredientGroups);
    }, [productData, router]);

    useEffect(() => {
        const productIngredients = productData.ingredientGroups.reduce((acc, group) => {
            return [...acc, ...group.items];
        }, []);
        setIngredientsOutput(productIngredients);
    }, [productData, router]);

    useEffect(() => {
        setProductIngredientGroups(productData.ingredientGroups);
    }, [productData]);

    useEffect(() => {
        if (!isLoadingPrice && !productDataValidating && !isLoading && !productData?.isStoreSelected && productData) {
            setModal({
                isVisible: true,
                message: i18.noStoreSelected,
                title: i18.productNotAvailableInStoreTitle,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18Fd, productData?.isStoreSelected, productData, i18.noStoreSelected, i18.productNotAvailableInStoreTitle]);

    const handleIngredientQtyChange = (ingredientId: string, qty: number): void => {
        const newIngredients = ingredientsOutput.map((ingredient) => {
            if (ingredient.id === ingredientId) {
                return { ...ingredient, qty };
            }
            return ingredient;
        });

        const newIngredientGroups = productIngredientGroups.map((group) => {
            return {
                ...group,
                items: group.items.map((ingredient) => {
                    if (ingredient.id === ingredientId) {
                        return { ...ingredient, qty };
                    }
                    return ingredient;
                }),
            };
        });

        setProductIngredientGroups(newIngredientGroups);
        setIngredientsOutput(newIngredients);
    };

    const saveForLater = (
        <ButtonSaveForLater
            saveForLaterCallback={async () => {
                if (!productData.isProductSavedInWishlist) {
                    const { errorCode } = await addProductToWishListHandler(addProductToWishListMutation, {
                        productId: productData.id,
                        priority: 1,
                        public: true,
                        quantity: 1,
                        type: "product",
                        storeId: selectedStore?.id,
                    });

                    globalContext.showNotification({
                        type: errorCode ? "error" : "success",
                        message: errorCode ? globalResources.internalServerError : i18.productAddedToWishlist,
                        autoClose: true,
                    });

                    if (!errorCode) {
                        await swrProductDataMutate(
                            {
                                data: {
                                    ...productData,
                                    isProductSavedInWishlist: true,
                                },
                                errorCode: null,
                            },
                            false
                        );
                    }
                } else {
                    globalContext.showNotification({
                        type: "error",
                        message: i18.productAlreadyInWishlist,
                        autoClose: true,
                    });
                }
            }}
        >
            {globalContext.isUserLoggedIn && (
                <span className="flex items-center pr-2">
                    <span className="inline-flex justify-center items-center rounded-full mr-3 product-banner__save-icon">
                        <span
                            className={`text-xl ${
                                productData.isProductSavedInWishlist ? "icon-heart-full" : "icon-heart"
                            }`}
                        />
                    </span>
                    <span className="underline">{i18.saveForLater}</span>
                </span>
            )}
        </ButtonSaveForLater>
    );

    const handleAddToCart = useCallback(async () => {
        setIsAddingToCart(true);
        const { data: basket, errorCode } = await addToCartFetcher(
            addToCartMutation,
            locale,
            productData.id,
            productQuantity,
            JSON.stringify(ingredientsOutput),
            productData.minQty,
            productData.maxQty
        );

        if (errorCode === "NO_STORE_SELECTED") {
            setModal({
                isVisible: true,
                message: i18.noStoreSelected,
                title: i18.productNotAvailableInStoreTitle,
            });

            setIsAddingToCart(false);
            return;
        } else if (errorCode) {
            globalContext.showNotification({
                type: "error",
                message: globalResources.internalServerError,
                autoClose: true,
            });

            setIsAddingToCart(false);
            return;
        }

        globalContext.setBasket(basket);

        const productBaseIngredients = productData.ingredientGroups.reduce((acc, group) => {
            return [...acc, ...group.items];
        }, []);
        setIngredientsOutput(productBaseIngredients);
        setProductIngredientGroups(productData.ingredientGroups);

        setIsAddingToCart(false);
        globalContext.setMinicartExpanded(true);
    }, [
        globalContext,
        globalResources.internalServerError,
        i18,
        ingredientsOutput,
        locale,
        productData.id,
        productData.ingredientGroups,
        productData.maxQty,
        productData.minQty,
        productQuantity,
    ]);

    return (
        <>
            <Head>
                <title>{productData.name}</title>
                <meta property="og:title" content={productData.name} key="title" />
            </Head>
            <MainLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                locale={locale}
            >
                <ProductBanner
                    imgMobile={productData.imgSquare}
                    imgDesktop={productData.imgLandscape}
                    title={productData.name}
                    backText={i18.back}
                    backPath={`/store/${productData.parentCategoryId}/products`}
                    isLoading={productData.isMasterProduct || !productData.inventory.orderable ? false : isLoadingPrice}
                    price={productData.isMasterProduct ? null : productPriceData?.data?.unitPrice ?? productData.price}
                    badges={[]}
                    ctas={globalData.data.sitePreferences.isWishlistEnabled ? saveForLater : null}
                />

                <div className="overflow-hidden">
                    <CenterContentWrapper>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="col-span-1 lg:col-span-8 xl:col-span-7">
                                <SizeTiles title={i18.selectSize} tiles={productData.sizeTiles} />
                                {!productData.isMasterProduct &&
                                    productData.inventory.orderable &&
                                    productIngredientGroups.map((group) => {
                                        return (
                                            <IngredientsSelector
                                                xlViewport={globalContext.viewports.xlarge}
                                                lgViewport={globalContext.viewports.large}
                                                isFetching={isLoadingPrice}
                                                key={group.id}
                                                title={group.name}
                                                selectors={group.items}
                                                quantityChangeFunction={(ingredientId, qty) => {
                                                    handleIngredientQtyChange(ingredientId, qty);
                                                }}
                                            />
                                        );
                                    })}
                            </div>
                            <div className="mt-4 col-span-1 lg:col-span-4 xl:col-span-5">
                                <Tabs tabsData={productData.tabs} />
                            </div>
                        </div>
                    </CenterContentWrapper>
                </div>
                <AddToCart
                    addToCartBtnLabel={i18.addToCartBtnLabel}
                    addToCartCallback={handleAddToCart}
                    setQuantityFn={setProductQuantity}
                    isOrderable={productData.inventory.orderable}
                    notAvailableText={i18.productNotAvailable}
                    isDisabled={isAddingToCart || productData.isMasterProduct || !productData.inventory.orderable}
                    maxQty={productData.maxQty}
                    isLoadingPrice={productData.isMasterProduct ? false : isLoadingPrice}
                    minQty={productData.minQty}
                    price={productData.isMasterProduct ? null : productPriceData?.data?.totalPrice}
                    quantity={productQuantity}
                />

                <Modal
                    forceUserAction
                    text={modal?.message}
                    actionFunction={() => {
                        router.push("/storelocator");
                    }}
                    onClose={() => setModal({ ...modal, isVisible: false })}
                    isPopupVisible={modal?.isVisible}
                    title={modal?.title}
                    yesText={i18.yesText}
                />

                <Modal
                    forceUserAction
                    actionFunction={() => handleModalConfirm()}
                    title={globalResources.changeStoreConfirmTitle}
                    text={
                        <>
                            <p className="text-sm text-t-secondary mt-2">
                                {i18Fd
                                    ? i18Fd.t("pdp:switchStoreModalText1", {
                                          storeName: storeDataFromQuery?.name,
                                      })
                                    : ""}
                            </p>

                            <p className="text-sm text-t-secondary mt-2">
                                {i18Fd
                                    ? i18Fd.t("pdp:switchStoreModalText2", {
                                          storeName: storeDataFromQuery?.name,
                                      })
                                    : ""}
                            </p>
                        </>
                    }
                    isPopupVisible={modalOpen}
                    yesText={globalResources.changeStoreYes}
                    noText={globalResources.changeStoreNo}
                    onClose={() => handleModalCancel()}
                />
            </MainLayout>
        </>
    );
};

export const getStaticProps = async ({
    locale,
    params,
}: GetStaticPropsContext): Promise<GetStaticPropsResult<PdpProps>> => {
    let i18n: i18n;
    const productId = params.productId.toString();
    let res = null;

    try {
        res = await getProductDataFetcher(getProductDataQuery, productId, locale);
    } catch (error) {
        return {
            redirect: {
                destination: error === "PRODUCT_NOT_FOUND" ? "/404" : "/500",
                permanent: false,
            },
        };
    }

    const { data } = res;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during category page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                addToCartBtnLabel: i18n.t("pdp:addToCartBtnLabel"),
                removeFromCartLabel: i18n.t("pdp:removeFromCartLabel"),
                selectSize: i18n.t("pdp:selectSize"),
                saveForLater: i18n.t("pdp:saveForLater"),
                back: i18n.t("pdp:back"),
                productNotAvailable: i18n.t("pdp:productNotAvailable"),
                productNotAvailableInStoreTitle: i18n.t("pdp:productNotAvailableInStoreTitle"),
                noStoreSelected: i18n.t("pdp:noStoreSelected"),
                yesText: i18n.t("pdp:yesText"),
                productNotAvailableSizeTile: i18n.t("pdp:productNotAvailableSizeTile"),
                productAlreadyInWishlist: i18n.t("pdp:productAlreadyInWishlist"),
                productAddedToWishlist: i18n.t("pdp:productAddedToWishlist"),
            },
            product: data,
            globalResources: populateGlobalResources(i18n),
        },
        revalidate: revalidatePagesConfig.pdp,
    };
};

export const getStaticPaths: GetStaticPaths = async ({ defaultLocale }) => {
    const { data, errorCode } = await getIsrPreRenderedPdpsFetcher(getIsrPreRenderedPdpsQuery, defaultLocale);

    if (errorCode) {
        throw new Error(`Error pre-rendering pdps: ${errorCode}`);
    }

    // Get the paths we want to pre-render based on products
    const paths = data.map((product: any) => ({
        params: { productId: product.id, slug: slugify(product.name) },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: "blocking" };
};

export default Pdp;
