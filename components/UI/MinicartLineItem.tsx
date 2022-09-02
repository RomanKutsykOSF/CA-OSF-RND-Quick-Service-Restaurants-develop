import ButtonQuantity from "components/UI/ButtonQuantity";
import { Basket, ProductLineItem } from "interfaces/globalContext";
import slugify from "slugify";
import Link from "next/link";
import { useState } from "react";

interface MinicartLineItemProps extends ProductLineItem {
    updateLineItemQty: (lineItemId: string, newQty: number, locale) => Promise<void | Basket>;
    removeText: string;
    quantityUpdateCallback: (updatedCartData) => any;
    locale: string;
}

const MinicartLineItem = ({
    itemId,
    productId,
    productName,
    ingredientsString,
    price,
    minQty,
    maxQty,
    quantity,
    locale,
    updateLineItemQty,
    quantityUpdateCallback,
    removeText,
}: MinicartLineItemProps): JSX.Element => {
    const nameSlug = slugify(productName);
    const link = `/product/${productId}/${nameSlug}`;
    const [isFetching, setIsFetching] = useState(false);

    const handleQuantityChange = async (itemId, quantity, locale): Promise<void> => {
        setIsFetching(true);

        const updatedCartData = await updateLineItemQty(itemId, quantity, locale);
        quantityUpdateCallback(updatedCartData);

        setIsFetching(false);
    };

    return (
        <li className="py-3 minicart-line-item">
            <Link href={link}>
                <p className="mb-1 flex justify-between font-bold text-sm cursor-pointer">
                    <span>{productName}</span>
                    <span>{price}</span>
                </p>
            </Link>
            <p className="mb-4 text-sm">{ingredientsString}</p>
            <div className="flex items-center">
                <ButtonQuantity
                    variant={quantity === minQty ? "quantity-selector--remove" : "quantity-selector"}
                    disabled={isFetching}
                    cssIconClass={quantity === minQty ? "" : "icon-minus"}
                    onClick={() => handleQuantityChange(itemId, quantity - 1, locale)}
                >
                    {quantity === minQty ? removeText : ""}
                </ButtonQuantity>

                <span className="mx-2 font-bold text-sm">{quantity}</span>
                <ButtonQuantity
                    variant="quantity-selector"
                    cssIconClass="icon-plus"
                    disabled={isFetching || quantity === maxQty}
                    onClick={() => handleQuantityChange(itemId, quantity + 1, locale)}
                />
            </div>

            <style jsx>{`
                .minicart-line-item:not(:last-child) {
                    border-bottom: 1px solid var(--br-disabled);
                }
            `}</style>
        </li>
    );
};

export default MinicartLineItem;
