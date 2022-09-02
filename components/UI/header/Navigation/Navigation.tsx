import MainNavDesktop from "./MainNavDesktop";
import MainNavMobile from "./MainNavMobile";
import Minicart from "components/UI/Minicart";
import { Basket, CategorySearchItemInterface, ProductSearchItemInterface } from "interfaces/globalContext";
import LocalePicker from "components/UI/LocalePicker";
import SearchSuggestions from "components/search/SearchSuggestions";
import { useRouter } from "next/router";
import updateLineItemQty, { updateLineItemQtyMutation } from "bdConnector/cart/updateLineItemQty";
import { StoreLocatorContext } from "context/storelocator";
import SelectedStoreMenuItem from "./SelectedStoreMenuItem";
import { useContext } from "react";
import Link from "next/link";

export type Logo = {
    logoImgPath: string;
    logoRedirectUrl: string;
};

export type MenuLink = {
    name: string;
    link: string;
    visibility: "visible" | "hidden" | "guestOnly" | "loggedInOnly";
};

interface NavigationTextResources {
    searchPlaceholder: string;
    searchCategoriesTile: string;
    searchProductsTile: string;
    changeLocation: string;
    yourOrder: string;
    item: string;
    items: string;
    total: string;
    tax: string;
    deliveryFee: string;
    checkout: string;
    viewCart: string;
    remove: string;
    localesTextMap: {
        localeKeyTexts: Record<string, string>;
    };
    serverError: string;
    searchNoResults: string;
    productNotAvailableText: string;
}

interface NavigationProps {
    isUserLoggedIn: boolean;
    links: MenuLink[];
    logo: Logo;
    overflow: boolean;
    locale: string;
    textResources: NavigationTextResources;
    isSearchExpanded: boolean;
    isFetchingSearchResults: boolean;
    searchCallbackFunction: (searchText: string) => void;
    categorySearchResults: CategorySearchItemInterface[];
    productSearchResults: ProductSearchItemInterface[];
    setIsSearchExpanded: (state: boolean) => void;
    basket: Basket;
}

export const getNavLinkVisibility = (menuLink: MenuLink, isUserLoggedIn: boolean): string => {
    switch (menuLink.visibility) {
        case "hidden":
            return "hidden";
        case "visible":
            return "inline-block";
        case "guestOnly":
            return `${isUserLoggedIn ? "hidden" : "inline-block"}`;
        case "loggedInOnly":
            return `${!isUserLoggedIn ? "hidden" : "inline-block"}`;
        default:
            throw new Error("Invalid nav link visibility prop");
    }
};

const Navigation = ({
    links,
    logo,
    isUserLoggedIn,
    textResources,
    isSearchExpanded,
    isFetchingSearchResults,
    searchCallbackFunction,
    categorySearchResults,
    productSearchResults,
    setIsSearchExpanded,
    basket,
    locale,
}: NavigationProps): JSX.Element => {
    const router = useRouter();
    const { selectedStore } = useContext(StoreLocatorContext);

    const { locales, locale: activeLocale } = router;

    return (
        <>
            <nav className={`border border-r-0 border-t-0 border-l-0 border-bgr-tertiary-faded`}>
                <div className="flex justify-between items-center px-4 lg:px-8 h-16 ">
                    <MainNavDesktop isUserLoggedIn={isUserLoggedIn} logo={logo} links={links} />
                    <SearchSuggestions
                        productNotAvailableText={textResources.productNotAvailableText}
                        noResultsText={textResources.searchNoResults}
                        placeholderText={textResources.searchPlaceholder}
                        categoriesTileText={textResources.searchCategoriesTile}
                        isExpanded={isSearchExpanded}
                        categoryResults={categorySearchResults}
                        productResults={productSearchResults}
                        productsTileText={textResources.searchProductsTile}
                        searchCallbackFunction={(searchText) => {
                            searchCallbackFunction(searchText);
                        }}
                        setIsExpanded={setIsSearchExpanded}
                        isFetching={isFetchingSearchResults}
                    />
                    <MainNavMobile
                        isUserLoggedIn={isUserLoggedIn}
                        logo={logo}
                        links={links}
                        locales={locales}
                        activeLocale={activeLocale}
                        localesTextMap={textResources.localesTextMap}
                        changeLocationText={textResources.changeLocation}
                    />
                    <LocalePicker
                        locales={locales}
                        activeLocale={activeLocale}
                        localesTextMap={textResources.localesTextMap}
                    />
                    <div className="hidden lg:block">
                        <SelectedStoreMenuItem selectedStore={selectedStore} />
                    </div>
                    {selectedStore && (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsSearchExpanded(true)}
                                className={`icon-search text-t-primary text-lg mr-3 rounded-full mx-2 ml-auto lg:ml-1`}
                            />
                            {isUserLoggedIn && (
                                <Link href={"/account/wishlist"}>
                                    <button
                                        type="button"
                                        className={`icon-heart text-t-primary text-lg mr-3 ml-0 rounded-full mx-2 lg:ml-1`}
                                    />
                                </Link>
                            )}
                        </>
                    )}
                    <Minicart
                        title={textResources.yourOrder}
                        items={basket?.productItems}
                        itemsCountText={`${
                            basket?.productItems?.reduce((acc, lineItem) => acc + lineItem?.quantity, 0) ?? 0
                        } ${basket?.productItems?.length === 1 ? textResources.item : textResources.items}`}
                        totalText={textResources.total}
                        totalValue={basket?.orderTotal}
                        deliveryFee={basket?.shippingTotal}
                        deliveryFeeText={textResources.deliveryFee}
                        taxTotalText={textResources.tax}
                        taxTotal={basket?.taxTotal}
                        checkoutText={textResources.checkout}
                        checkoutPath="/checkout"
                        cartText={textResources.viewCart}
                        cartPath="/cart"
                        quantityChangeFunction={async (lineItemId, quantity, locale) => {
                            const updateLineItemRes = await updateLineItemQty(
                                updateLineItemQtyMutation,
                                lineItemId,
                                quantity,
                                locale,
                                basket?.basketId
                            );

                            return updateLineItemRes;
                        }}
                        removeText={textResources.remove}
                        locale={locale}
                        serverError={textResources.serverError}
                    />
                </div>
                <div className="lg:hidden">
                    <SelectedStoreMenuItem selectedStore={selectedStore} />
                </div>
            </nav>
            <style jsx>{`
                .border-bottom {
                    border-bottom: 1px solid var(--br-secondary);
                }
            `}</style>
        </>
    );
};

export default Navigation;
