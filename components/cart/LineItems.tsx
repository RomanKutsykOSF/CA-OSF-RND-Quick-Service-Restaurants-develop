import LineItem from "components/cart/LineItem";
import { ProductLineItem } from "interfaces/globalContext";

export interface LineItemsProps {
    title: string;
    items: ProductLineItem[];
    removeItemText: string;
    itemsTotalSuffixSingleText: string;
    itemsTotalSuffixMultipleText: string;
    quantityChangeFunction: (lineItemId: string, newQty: number, locale: string) => Promise<any>;
    quantityUpdateCallback: (updatedCartData) => any;
    locale: string;
}

const LineItems = ({
    title,
    itemsTotalSuffixSingleText,
    itemsTotalSuffixMultipleText,
    items,
    removeItemText,
    quantityChangeFunction,
    quantityUpdateCallback,
    locale,
}: LineItemsProps): JSX.Element => {
    const itemsTotalQty = items?.reduce((acc, item) => acc + item.quantity, 0);
    const itemsTotalSuffix = itemsTotalQty === 1 ? itemsTotalSuffixSingleText : itemsTotalSuffixMultipleText;
    const lineItems = items?.map((item) => {
        return (
            <LineItem
                key={item.itemId}
                itemId={item.itemId}
                ingredientsString={item.ingredientsString}
                productName={item.productName}
                price={item.price}
                productId={item.productId}
                quantity={item.quantity}
                size={item.size}
                image={item.image}
                maxQty={item.maxQty}
                minQty={item.minQty}
                removeItemText={removeItemText}
                quantityChangeFunction={quantityChangeFunction}
                quantityUpdateCallback={quantityUpdateCallback}
                locale={locale}
            />
        );
    });

    return (
        <div className="col-span-2 cart-line-items">
            <div className="lg:flex justify-between items-end">
                <h2 className="my-3 text-lg lg:text-2xl font-bold">{title}</h2>
                <p className="mb-1 lg:mb-3 text-sm">
                    {itemsTotalQty} {itemsTotalSuffix}
                </p>
            </div>
            <div>{lineItems}</div>
        </div>
    );
};

export default LineItems;
