import Button from "components/UI/Button";
import ButtonQuantity from "components/UI/ButtonQuantity";
import DotsLoader from "components/UI/DotsLoader";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import { debounce } from "utils";

interface AddToCartProps {
    addToCartBtnLabel: string;
    isDisabled: boolean;
    addToCartCallback: () => any;
    price: string | null;
    minQty: number;
    maxQty: number;
    isLoadingPrice: boolean;
    isOrderable: boolean;
    notAvailableText: string;
    quantity: number;
    setQuantityFn: (quantity: number) => any;
}

const AddToCart = ({
    addToCartBtnLabel,
    isDisabled,
    addToCartCallback,
    price,
    minQty,
    isOrderable,
    isLoadingPrice,
    notAvailableText,
    maxQty,
    quantity,
    setQuantityFn,
}: AddToCartProps): JSX.Element => {
    return (
        <div className={`fixed border-t border-bgr-tertiary-faded w-full z-10 bottom-0 bg-bgr-primary p-4`}>
            <CenterContentWrapper>
                <div className="mb-2 lg:hidden">
                    {!isOrderable && (
                        <span>
                            <span className="font-bold text-t-primary mr-2 text-sm">{notAvailableText}</span>
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className={"flex items-center"}>
                        <ButtonQuantity
                            variant="quantity-selector"
                            disabled={quantity <= minQty || quantity <= 0 || isLoadingPrice || isDisabled}
                            cssIconClass="icon-minus"
                            onClick={debounce((): void => {
                                setQuantityFn(quantity - 1);
                            }, 150)}
                        ></ButtonQuantity>
                        <span className="mx-2 font-bold text-sm ">{quantity}</span>
                        <ButtonQuantity
                            variant="quantity-selector"
                            cssIconClass="icon-plus"
                            disabled={quantity >= maxQty || isLoadingPrice || isDisabled}
                            onClick={debounce((): void => {
                                setQuantityFn(quantity + 1);
                            }, 150)}
                        />
                    </div>
                    <div className={`flex items-center`}>
                        <span className={`font-bold text-t-primary mr-2 text-lg hidden lg:block`}>
                            {isLoadingPrice ? <DotsLoader variant="dark" /> : isOrderable ? price : notAvailableText}
                        </span>

                        <Button disabled={isLoadingPrice || isDisabled} onClick={addToCartCallback} variant="primary">
                            {addToCartBtnLabel}
                        </Button>
                    </div>
                </div>
            </CenterContentWrapper>
        </div>
    );
};

export default AddToCart;
