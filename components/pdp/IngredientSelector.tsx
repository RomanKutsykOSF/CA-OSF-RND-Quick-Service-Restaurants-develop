import Image from "next/image";
import ButtonQuantity from "components/UI/ButtonQuantity";

export interface IngredientSelectorProps {
    ingredientId: string;
    title: string;
    qty: number;
    minQty: number;
    maxQty: number;
    quantityChangeFunction: (ingredientId: string, newQty: number) => any;
    imageUrl: string;
    price: string;
    isDisabled: boolean;
    xlViewport: number;
    lgViewport: number;
}

const IngredientSelector = ({
    ingredientId,
    imageUrl,
    isDisabled,
    title,
    price,
    qty,
    minQty,
    maxQty,
    quantityChangeFunction,
    xlViewport,
    lgViewport,
}: IngredientSelectorProps): JSX.Element => {
    const isRemoveTextVisible = qty <= 1;

    return (
        <div className="flex rounded-l-xl rounded-r-xl ingredient-selector h-16">
            <div className="self-center ingredient-selector__image flex-shrink-0">
                <Image
                    className="rounded-l-xl"
                    src={imageUrl || "/images/no-image-icon.png"}
                    layout="responsive"
                    width={62}
                    height={62}
                />
            </div>
            <div className="ingredient-selector__content ml-3 flex flex-col justify-center flex-shrink-0">
                <p className="font-bold text-sm overflow-hidden whitespace-nowrap text-ellipsis">{title}</p>
                <p className="text-sm">{price}</p>
            </div>
            <div className="flex flex-shrink ml-auto items-center mr-2">
                <ButtonQuantity
                    variant={isRemoveTextVisible ? "quantity-selector--remove" : "quantity-selector"}
                    cssIconClass={isRemoveTextVisible ? "" : "icon-minus"}
                    disabled={isDisabled || qty === minQty}
                    onClick={() => quantityChangeFunction(ingredientId, qty - 1)}
                >
                    {isRemoveTextVisible ? "Remove" : ""}
                </ButtonQuantity>
                <span className="mx-1 font-bold text-sm ">{qty}</span>
                <ButtonQuantity
                    variant="quantity-selector"
                    cssIconClass="icon-plus"
                    disabled={isDisabled || qty === maxQty}
                    onClick={() => quantityChangeFunction(ingredientId, qty + 1)}
                />
            </div>
            <style jsx>{`
                .ingredient-selector {
                    border: 1px solid var(--br-secondary);
                }

                .ingredient-selector__image {
                    width: 62px;
                    height: 62px;
                }

                @media (min-width: ${lgViewport}px) {
                    .ingredient-selector__content {
                        max-width: 85px;
                    }
                }

                @media (min-width: ${xlViewport}px) {
                    .ingredient-selector__content {
                        max-width: 95px;
                    }
                }
            `}</style>
        </div>
    );
};

export default IngredientSelector;
