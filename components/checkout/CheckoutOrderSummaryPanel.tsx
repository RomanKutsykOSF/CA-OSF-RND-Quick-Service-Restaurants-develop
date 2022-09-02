import React from "react";
import OrderItem from "components/UI/OrderItem";
import Divider from "components/UI/Divider";
import { ProductLineItem } from "interfaces/globalContext";
export interface CheckoutOrderSummaryProps {
    orderItems: ProductLineItem[];
    subtotal: string;
    shippingTotal: string;
    total: string;
    taxTotal: string;
    storeName?: string;
    storeId?: string;
}
export interface CheckoutOrderSummaryPanelProps extends CheckoutOrderSummaryProps {
    title: string;
    orderItems: ProductLineItem[];
    subtotalText: string;
    deliveryText: string;
    quantityText: string;
    totalText: string;
    desktopViewport?: number;
    className?: string;
    totalTaxText?: string;
}

const CheckoutOrderSummaryPanel = ({
    title,
    orderItems,
    subtotalText,
    subtotal,
    deliveryText,
    quantityText,
    shippingTotal,
    taxTotal,
    totalTaxText,
    totalText,
    total,
    desktopViewport,
    className,
}: CheckoutOrderSummaryPanelProps): JSX.Element => {
    desktopViewport = desktopViewport ? desktopViewport : 1024;
    return (
        <>
            <section className={`checkout-summary-panel bg-bgr-faded rounded-lg p-6 w-full ${className}`}>
                <p className="font-primary font-bold text-t-primary text-sm">{title}</p>
                <Divider className="mt-3" />
                <section className="pt-2">
                    {orderItems?.map((orderItem) => {
                        return (
                            <OrderItem
                                key={orderItem.itemId}
                                image={orderItem.image}
                                itemId={orderItem.itemId}
                                productId={orderItem.productId}
                                productName={orderItem.productName}
                                price={orderItem.price}
                                quantityText={quantityText}
                                quantity={orderItem.quantity}
                                size={orderItem.size}
                                ingredientsString={orderItem.ingredientsString}
                                className="mt-3"
                            />
                        );
                    })}
                </section>
                <Divider className="mt-6" />
                <section>
                    <p className="flex justify-between mt-4">
                        <span className="font-primary text-sm">{subtotalText}:</span>
                        <span className="font-primary font-bold">{subtotal}</span>
                    </p>
                    <p className="flex justify-between mt-4">
                        <span className="font-primary text-sm">{deliveryText}:</span>
                        <span className="font-primary font-bold">{shippingTotal}</span>
                    </p>
                    <p className="flex justify-between mt-4">
                        <span className="font-primary text-sm">{totalTaxText}:</span>
                        <span className="font-primary font-bold">{taxTotal}</span>
                    </p>
                    <p className="flex justify-between mt-4">
                        <span className="font-primary text-lg font-medium">{totalText}:</span>
                        <span className="font-primary font-bold text-xl">{total}</span>
                    </p>
                </section>
            </section>
            <style jsx>{`
                @media (min-width: ${desktopViewport}px) {
                    .checkout-summary-panel {
                        max-width: 375px;
                    }
                }
            `}</style>
        </>
    );
};

export default CheckoutOrderSummaryPanel;
