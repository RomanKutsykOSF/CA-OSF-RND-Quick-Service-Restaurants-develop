import Button from "components/UI/Button";
import { GlobalContext } from "context/global";
import { useContext } from "react";

export interface OrderSummaryDataProps {
    subtotal: string;
    total: string;
    taxTotal: string;
    shippingTotal?: string;
}
export interface OrderSummaryProps extends OrderSummaryDataProps {
    subtotalText: string;
    totalText: string;
    btnText: string;
    btnPath: string;
    totalTaxText: string;
}

const CartOrderSummary = ({
    subtotalText,
    subtotal,
    totalText,
    total,
    btnText,
    btnPath,
    taxTotal,
    totalTaxText,
}: OrderSummaryProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <div className="rounded-3xl py-4 lg:p-5 self-start cart-order-summary">
            <ul className="list-none">
                <li className="mb-2 flex justify-between">
                    <span className="text-sm">{subtotalText}</span>
                    <span className="font-bold text-md">{subtotal}</span>
                </li>
            </ul>
            <p className="my-4 flex justify-between">
                <span className="text-md">{totalTaxText}</span>
                <span className="text-lg font-bold">{taxTotal}</span>
            </p>
            <p className="my-4 flex justify-between">
                <span className="text-md">{totalText}</span>
                <span className="text-lg font-bold">{total}</span>
            </p>
            <Button variant="primary" link={btnPath} className="w-full">
                {btnText}
            </Button>
            <style jsx>{`
                @media (min-width: ${globalContext.viewports.large}px) {
                    .cart-order-summary {
                        background-color: var(--bgr-faded);
                        position: relative;
                    }
                }
            `}</style>
        </div>
    );
};

export default CartOrderSummary;
