import React, { useContext } from "react";
import i18nInit from "i18";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { GlobalContext } from "context/global";
import MainLayout from "components/layouts/main";
import Title from "components/UI/Title";
import Divider from "components/UI/Divider";
import populateGlobalResources from "i18/populateGlobalResources";
import OrderItem from "components/UI/OrderItem";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import { GlobalData } from "interfaces/globalContext";
import useSWR from "swr";
import { FetcherResponse } from "bdConnector/types";
import { getPublicWishlistQuery } from "bdConnector/account/getPublicWishlist";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import getPublicWishlistFetcher from "bdConnector/account/getPublicWishlist";
import DotsLoader from "components/UI/DotsLoader";
import { useRouter } from "next/router";

interface AccountProps {
    i18: Record<string, string>;
    globalResources: Record<string, string>;
    locale: string;
    wishlistId: string;
    globalData: FetcherResponse<GlobalData>;
}

const Account = ({ i18, globalResources, globalData, locale, wishlistId }: AccountProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    const router = useRouter();

    const { data: useSwrWishlistData, isValidating } = useSWR(
        [getPublicWishlistQuery, wishlistId],
        getPublicWishlistFetcher,
        {
            onError: () => {
                router.replace("/404");
            },
        }
    );

    const productsList = useSwrWishlistData?.data?.perStoreProductListItems.map((group) => {
        return (
            <div key={group.id}>
                <h1 className="text-lg font-bold font-primary my-4">{group.name}</h1>

                {group.items.map((tile) => {
                    return (
                        <div key={tile.id}>
                            <div className="grid grid-cols-2 gap-3">
                                <OrderItem
                                    itemId={tile.id}
                                    productId={tile.productId}
                                    image={tile.image}
                                    productName={tile.name}
                                    size={tile?.size ?? null}
                                    quantityText={i18.accountOrdersQuantityText}
                                    quantity={tile?.quantity ?? null}
                                    price={tile.price}
                                    btnText={i18.wishlistPortalBtnRemove}
                                    storeId={tile.storeId}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    });
    return (
        <>
            <MainLayout
                globalResources={globalResources}
                themeVariables={globalContext.themeCssString}
                globalData={globalData}
                isPageLoginProtected={true}
                locale={locale}
            >
                <CenterContentWrapper maxWidth={768}>
                    {isValidating ? (
                        <div className="flex h-custom items-center justify-center w-full">
                            <DotsLoader variant="dark" />
                        </div>
                    ) : (
                        <div className="min-h-custom">
                            <Title
                                type="h2"
                                className="lg:flex lg:flex-initial font-bold lg:my-3 text-xl lg:mt-10 hidden"
                            >
                                {i18.wishlistPortalTitle}
                            </Title>
                            <Divider theme="light" className="lg:block hidden"></Divider>
                            <div className="my-4">{productsList}</div>
                        </div>
                    )}
                </CenterContentWrapper>
            </MainLayout>
            <style jsx>{`
                .min-h-custom {
                    min-height: 50vh;
                }

                .h-custom {
                    height: 50vh;
                }
            `}</style>
        </>
    );
};

export const getServerSideProps = async ({
    locale,
    params,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<AccountProps>> => {
    let i18n: any;
    const wishlistId = params.wishlistId.toString();

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during public wishlist page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            globalData,
            i18: {
                wishlistPortalTitle: i18n.t("wishlistPortal:title"),
                wishlistPortalBtnRemove: i18n.t("wishlistPortal:btnRemove"),
                accountOrdersQuantityText: i18n.t("accountOrders:quantityText"),
            },
            wishlistId: wishlistId,
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Account;
