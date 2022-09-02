import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductLineItem } from "interfaces/globalContext";
import Button from "./Button";
import slugify from "slugify";
export interface OrderItemProps extends ProductLineItem {
    className?: string;
    quantityText: string;
    btnText?: string;
    btnClickCallbackFunction?: (itemId: string) => any;
    storeId?: string;
    isAvailable?: boolean;
    productNotAvailableText?: string;
}

const OrderItem = ({
    itemId,
    productId,
    image,
    productName,
    size,
    quantityText,
    quantity,
    price,
    ingredientsString,
    className,
    btnText,
    btnClickCallbackFunction,
    storeId,
    productNotAvailableText,
    isAvailable = true,
}: OrderItemProps): JSX.Element => {
    const nameSlug = slugify(productName);
    const link = storeId ? `/product/${productId}/${nameSlug}?storeId=${storeId}` : `/product/${productId}/${nameSlug}`;

    return (
        <>
            <div
                data-item-id={itemId}
                className={`order-item grid grid-flow-col gap-4 cursor-pointer ${className} ${
                    !isAvailable ? "product-unavailable pointer-events-none" : ""
                }`}
            >
                <Link href={link}>
                    <div>{image && <Image width={58} height={58} src={image} className={`rounded-xl`} />}</div>
                </Link>
                <div className="ml-4 grow-1">
                    <Link href={link}>
                        <div className="order-item-content">
                            <div className="flex justify-between">
                                <span className="font-primary text-lg font-bold text-t-primary">{productName}</span>
                                <span className="font-primary text-lg font-bold text-t-primary">
                                    {isAvailable ? price : null}
                                </span>
                            </div>
                            {size && isAvailable && <span className="font-primary text-sm text-t-primary">{size}</span>}
                            {quantity && isAvailable && (
                                <div className="flex">
                                    <span className="font-primary text-sm text-t-primary">{quantityText}</span>
                                    <span className="font-primary text-sm ml-1 text-t-primary">{quantity}</span>
                                </div>
                            )}
                        </div>
                    </Link>
                    {btnClickCallbackFunction && (
                        <div>
                            {btnText ? (
                                <Button
                                    variant="text-link-underline"
                                    customTextColorClass="text-t-secondary-2"
                                    className="mb-4"
                                    onClick={() => btnClickCallbackFunction(itemId)}
                                >
                                    {btnText}
                                </Button>
                            ) : (
                                ""
                            )}
                        </div>
                    )}
                    {ingredientsString && isAvailable && (
                        <span className="font-primary text-sm">{ingredientsString}</span>
                    )}
                    {!isAvailable && <span className="font-primary text-sm">{productNotAvailableText}</span>}
                </div>
            </div>

            <style jsx>{`
                .order-item {
                    grid-template-columns: 58px 1fr;
                }

                .product-unavailable {
                    filter: grayscale(100%);
                }
            `}</style>
        </>
    );
};

export default OrderItem;
