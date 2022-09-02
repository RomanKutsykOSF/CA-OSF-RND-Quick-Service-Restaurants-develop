import getOrderFetcher, { getOrderQuery, Order } from "bdConnector/checkout/getOrder";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import CheckoutOrderSummaryPanel from "components/checkout/CheckoutOrderSummaryPanel";
import CheckoutLayout from "components/layouts/checkout";
import OSFStripe from "components/stripe/Stripe";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import { GlobalContext } from "context/global";
import i18nInit from "i18";
import populateGlobalResources from "i18/populateGlobalResources";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

const Payment = ({
    orderData,
    globalData,
    globalResources,
    locale,
    i18,
}: {
    orderData: Order;
    globalData: any;
    globalResources: any;
    locale: string;
    i18: any;
}): JSX.Element => {
    const router = useRouter();
    const globalContext = useContext(GlobalContext);

    const localeToStripeLocaleMap = {
        "en-US": "us",
        "es-ES": "es",
    };

    return (
        <CheckoutLayout
            globalResources={globalResources}
            themeVariables={globalContext.themeCssString}
            globalData={globalData}
            locale={locale}
        >
            <CenterContentWrapper>
                <div className="flex flex-col lg:flex-row justify-center">
                    <div className="mt-8 flex-1">
                        {router.isReady && orderData && (
                            <OSFStripe
                                orderNo={orderData.orderNo}
                                appearance={{ theme: "stripe" }}
                                colors={{
                                    background: "var(--bgr-tertiary)",
                                    btnText: "var(--t-tertiary)",
                                    paymentMessageColor: "--t-primary",
                                    loaderOverlay: "var(--bgr-secondary)",
                                }}
                                graphqlBaseUrl={process.env.NEXT_PUBLIC_API_GRAPHQL_ENDPOINT}
                                payButtonText={"Submit Payment"}
                                redirectRelativePath="orderConfirmation"
                                siteId={process.env.NEXT_PUBLIC_SFB2CAPI_SITE_ID}
                                stripeLocale={localeToStripeLocaleMap[locale] || "en"}
                                stripePublicKey={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
                                unexpectedErrorText={globalResources.internalServerError}
                            />
                        )}
                    </div>
                    <div>
                        {orderData && (
                            <CheckoutOrderSummaryPanel
                                taxTotal={orderData.taxTotal}
                                totalTaxText={i18.totalTaxText}
                                className="lg:ml-8 mt-8"
                                quantityText={globalResources?.quantityText}
                                title={`${orderData.productItems.length} ${"items"}`}
                                orderItems={orderData.productItems}
                                deliveryText={i18.deliveryFeeText}
                                shippingTotal={orderData.shippingTotal}
                                subtotalText={i18.subtotalText}
                                subtotal={orderData.productSubTotal}
                                totalText={i18.totalText}
                                total={orderData.orderTotal}
                                desktopViewport={globalContext.viewports.large}
                            />
                        )}
                    </div>
                </div>
            </CenterContentWrapper>
        </CheckoutLayout>
    );
};

export const getServerSideProps = async ({
    locale,
    params,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    let i18n: any;
    const orderNo = params?.orderNo.toString();

    let orderData = null;

    try {
        const { data: order } = await getOrderFetcher(getOrderQuery, orderNo);
        orderData = order;
    } catch (error) {
        console.error(error);
    }

    const orderId = orderNo;

    if (orderData?.paymentStatus === "paid") {
        return {
            redirect: {
                destination: `/orderConfirmation/${orderId}`,
                permanent: false,
            },
        };
    }

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during payment page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    return {
        props: {
            locale,
            orderNo,
            globalData,
            orderData,
            i18: {
                totalTaxText: i18n.t("checkout:totalTaxText"),
                deliveryFeeText: i18n.t("checkout:deliveryFeeText"),
                subtotalText: i18n.t("checkout:subtotalText"),
                totalText: i18n.t("checkout:totalText"),
            },
            globalResources: populateGlobalResources(i18n),
        },
    };
};

export default Payment;
