import { Order } from "bdConnector/checkout/getOrder";
import getOrderStatusFetcher, { getOrderStatusQuery } from "bdConnector/checkout/getOrderStatus";
import getGlobalDataFetcher, { getGlobalDataQuery } from "bdConnector/globalData/getGlobalData";
import CheckoutOrderSummaryPanel from "components/checkout/CheckoutOrderSummaryPanel";
import MainLayout from "components/layouts/main";
import Divider from "components/UI/Divider";
import KeyValueItem from "components/UI/KeyValueItem";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import Title from "components/UI/Title";
import { GlobalContext } from "context/global";
import i18nInit from "i18";
import populateGlobalResources from "i18/populateGlobalResources";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useContext } from "react";

interface OrderStatusPageProps {
    locale: string;
    globalData: any;
    globalResources: any;
    i18: any;
    orderData: Order;
}

const OrderStatus = ({ locale, globalData, globalResources, i18, orderData }: OrderStatusPageProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    return (
        <MainLayout
            globalResources={globalResources}
            themeVariables={globalContext.themeCssString}
            globalData={globalData}
            locale={locale}
        >
            <CenterContentWrapper>
                {orderData && (
                    <div className="py-14">
                        <div className="flex flex-col lg:items-start lg:flex-row lg:mt-10">
                            <div className="grow">
                                <Title alignment="left" type="h1">
                                    {i18.orderStatusTitle}
                                </Title>
                                <Divider className="w-full" />

                                <KeyValueItem
                                    showTopMargin={true}
                                    name={i18.orderNumberText}
                                    value={orderData?.orderNo}
                                />
                                <KeyValueItem
                                    showTopMargin={true}
                                    name={i18.orderStatusText}
                                    value={orderData?.status}
                                />
                                <KeyValueItem
                                    showTopMargin={true}
                                    name={i18.paymentStatusText}
                                    value={orderData?.paymentStatus}
                                />
                                <KeyValueItem
                                    showTopMargin={true}
                                    name={i18.orderDateText}
                                    value={new Date(orderData?.creationDate).toLocaleDateString()}
                                />
                                <KeyValueItem
                                    showTopMargin={true}
                                    name={i18.storeNameText}
                                    value={orderData?.storeName}
                                />
                                <KeyValueItem showTopMargin={true} name={i18.storeIdText} value={orderData?.storeId} />
                                <KeyValueItem
                                    showTopMargin={true}
                                    name={i18.shippingStatusText}
                                    value={orderData?.shippingStatus}
                                />
                            </div>
                            <div>
                                <CheckoutOrderSummaryPanel
                                    className="lg:ml-8 mt-5 lg:mt-0"
                                    taxTotal={orderData?.taxTotal}
                                    shippingTotal={orderData?.shippingTotal}
                                    totalTaxText={i18.totalTaxText}
                                    quantityText={i18.quantityText}
                                    title={`${orderData?.shippingItems?.length} items`}
                                    orderItems={orderData?.productItems}
                                    deliveryText={i18.deliveryFeeText}
                                    subtotalText={i18.subtotalText}
                                    subtotal={orderData?.productSubTotal}
                                    totalText={i18.orderTotalText}
                                    total={orderData?.orderTotal}
                                    desktopViewport={globalContext.viewports.large}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CenterContentWrapper>
        </MainLayout>
    );
};

export const getServerSideProps = async ({
    locale,
    locales,
    params,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    let i18n: any;

    try {
        i18n = await i18nInit(locale);
    } catch (e) {
        console.log("Error during orderStatusPage page i18n initialization:", e);
    }

    const globalData = await getGlobalDataFetcher(getGlobalDataQuery, locale);

    const { data } = await getOrderStatusFetcher(
        getOrderStatusQuery,
        params.orderNo as string,
        params.phoneNumber as string,
        params.timestamp as string
    );

    if (!data) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        };
    }

    return {
        props: {
            globalResources: populateGlobalResources(i18n),
            locales,
            locale,
            globalData,
            i18: {
                orderStatusTitle: i18n.t("orderStatusPage:orderStatusTitle"),
                orderNumberText: i18n.t("orderStatusPage:orderNumberText"),
                orderStatusText: i18n.t("orderStatusPage:orderStatusText"),
                paymentStatusText: i18n.t("orderStatusPage:paymentStatusText"),
                orderDateText: i18n.t("orderStatusPage:orderDateText"),
                storeNameText: i18n.t("orderStatusPage:storeNameText"),
                storeIdText: i18n.t("orderStatusPage:storeIdText"),
                shippingStatusText: i18n.t("orderStatusPage:shippingStatusText"),
                totalTaxText: i18n.t("orderStatusPage:totalTaxText"),
                quantityText: i18n.t("orderStatusPage:quantityText"),
                deliveryFeeText: i18n.t("orderStatusPage:deliveryFeeText"),
                subtotalText: i18n.t("orderStatusPage:subtotalText"),
                orderTotalText: i18n.t("orderStatusPage:orderTotalText"),
            },
            orderData: data,
        },
    };
};

export default OrderStatus;
