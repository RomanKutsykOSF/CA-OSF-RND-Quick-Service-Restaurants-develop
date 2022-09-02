// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const populateGlobalResources = (i18n): any => {
    return {
        "es-ES": i18n.t("global:spain"),
        "en-US": i18n.t("global:unitedStates"),
        "en-GB": i18n.t("global:unitedKingdom"),
        "de-DE": i18n.t("global:germany"),
        "fr-FR": i18n.t("global:france"),
        changeLocation: i18n.t("global:changeLocation"),
        quantityText: i18n.t("global:quantityText"),
        searchPlaceholderText: i18n.t("global:searchPlaceholderText"),
        searchCategoriesTileText: i18n.t("global:searchCategoriesTileText"),
        searchProductsTileText: i18n.t("global:searchProductsTileText"),
        changeStoreConfirmTitle: i18n.t("global:changeStoreConfirmTitle"),
        changeStoreConfirmText: i18n.t("global:changeStoreConfirmText"),
        changeStoreYes: i18n.t("global:changeStoreYes"),
        changeStoreNo: i18n.t("global:changeStoreNo"),
        item: i18n.t("global:item"),
        items: i18n.t("global:items"),
        yourOrder: i18n.t("global:yourOrder"),
        total: i18n.t("global:total"),
        viewCart: i18n.t("global:viewCart"),
        checkout: i18n.t("global:checkout"),
        removeText: i18n.t("global:removeText"),
        internalServerError: i18n.t("global:internalServerError"),
        deniedGeolocation: i18n.t("global:deniedGeolocation"),
        searchNoResultsFound: i18n.t("global:searchNoResultsFound"),
        productNotAvailableText: i18n.t("global:productNotAvailableText"),
        tax: i18n.t("global:tax"),
        deliveryFee: i18n.t("global:deliveryFee"),
    };
};

export default populateGlobalResources;
