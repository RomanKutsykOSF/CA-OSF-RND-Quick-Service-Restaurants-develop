import ButtonQuantity from "components/UI/ButtonQuantity";
import { ProductLineItem } from "interfaces/globalContext";
import Link from "next/link";
import { useState } from "react";
import slugify from "slugify";
export interface LineItemProps extends ProductLineItem {
    quantityChangeFunction: (lineItemId: string, newQty: number, locale: string) => Promise<any>;
    locale: string;
    removeItemText: string;
    quantityUpdateCallback: (updatedCartData) => any;
}

const LineItem = ({
    itemId,
    productId,
    removeItemText,
    productName,
    ingredientsString,
    price,
    minQty,
    maxQty,
    quantity,
    locale,
    quantityChangeFunction,
    quantityUpdateCallback,
}: LineItemProps): JSX.Element => {
    const nameSlug = slugify(productName);
    const link = `/product/${productId}/${nameSlug}`;
    const [isFetching, setIsFetching] = useState(false);

    const handleQtyChange = async (itemId: string, quantity: number, locale: string): Promise<void> => {
        setIsFetching(true);

        const { data } = await quantityChangeFunction(itemId, quantity, locale);

        quantityUpdateCallback(data);
        setIsFetching(false);
    };

    return (
        <div className="py-3 cart-line-item">
            <p className="mb-1 flex justify-between font-bold text-sm">
                <Link href={link}>
                    <span className="cursor-pointer">{productName}</span>
                </Link>
                <span>{price}</span>
            </p>
            <p className="mb-4 text-sm">{ingredientsString}</p>
            <div className="flex items-center">
                <ButtonQuantity
                    variant={quantity === minQty ? "quantity-selector--remove" : "quantity-selector"}
                    disabled={isFetching}
                    cssIconClass={quantity === minQty ? "" : "icon-minus"}
                    onClick={() => handleQtyChange(itemId, quantity - 1, locale)}
                >
                    {quantity === minQty ? removeItemText : ""}
                </ButtonQuantity>

                <span className="mx-2 font-bold text-sm">{quantity}</span>
                <ButtonQuantity
                    variant="quantity-selector"
                    cssIconClass="icon-plus"
                    disabled={isFetching || quantity === maxQty}
                    onClick={() => handleQtyChange(itemId, quantity + 1, locale)}
                />
            </div>

            <style jsx>{`
                .cart-line-item {
                    border-bottom: 1px solid var(--br-disabled);
                }

                .cart-line-item:first-child {
                    border-top: 1px solid var(--br-disabled);
                }
            `}</style>
        </div>
    );
};

export default LineItem;
