import React, { ReactNode, useContext } from "react";
import Image from "next/image";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import ButtonBack from "components/UI/ButtonBack";
import { GlobalContext } from "context/global";
import { ProductImage } from "interfaces/pdp";
import DotsLoader from "components/UI/DotsLoader";

interface ProductBannerProps {
    imgDesktop: ProductImage;
    imgMobile: ProductImage;
    title: string;
    backText: string;
    backPath: string;
    price: string | null;
    badges: ReactNode;
    isLoading: boolean;
    ctas?: ReactNode;
}

const ProductBanner = ({
    imgMobile,
    imgDesktop,
    title,
    backText,
    isLoading,
    backPath,
    price,
    badges,
    ctas,
}: ProductBannerProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <div className="relative product-banner">
            <div className="lg:hidden">
                {imgMobile && (
                    <Image
                        src={imgMobile.url}
                        title={imgMobile.title}
                        alt={imgMobile.alt}
                        layout="responsive"
                        width={375}
                        height={285}
                    />
                )}
            </div>
            <div className="hidden lg:block">
                {imgDesktop && (
                    <Image
                        src={imgDesktop.url}
                        title={imgDesktop.title}
                        alt={imgDesktop.alt}
                        layout="responsive"
                        width={1440}
                        height={218}
                    />
                )}
            </div>
            <div className="absolute inset-0 bg-transparent-black">
                <CenterContentWrapper className="h-full">
                    <div className="h-full grid flex-wrap items-end py-4 lg:py-5 product-banner__content">
                        <div className="product-banner__back-cta lg:justify-self-end">
                            <ButtonBack path={backPath} text={backText} />
                        </div>
                        <div className="justify-self-end lg:justify-self-start flex product-banner__badges">
                            {badges}
                        </div>
                        <div className="text-t-tertiary font-bold text-2xl lg:text-3xl product-banner__title">
                            {title}
                        </div>
                        <div className="mb-2 text-t-tertiary text-2xl product-banner__price">
                            {isLoading ? (
                                <div className="h-12 flex items-center">
                                    <DotsLoader variant="light" />
                                </div>
                            ) : (
                                price !== null && price
                            )}
                        </div>
                        <div className="text-t-tertiary text-sm product-banner__ctas lg:justify-self-end">{ctas}</div>
                    </div>
                </CenterContentWrapper>
            </div>
            <style jsx>{`
                .product-banner__content {
                    grid-template:
                        "back-cta badges" 1fr
                        "title title" auto
                        "price price" auto
                        "save save" auto
                        / 1fr 1fr;
                    align-items: start;
                }

                @media (min-width: ${globalContext.viewports.large}px) {
                    .product-banner__content {
                        grid-template:
                            "badges back-cta" auto
                            "title title" auto
                            "price save" auto
                            / 1fr 1fr;
                        align-items: end;
                    }
                }

                .product-banner__back-cta {
                    grid-area: back-cta;
                }

                .product-banner__badges {
                    grid-area: badges;
                }

                .product-banner__title {
                    grid-area: title;
                }

                .product-banner__price {
                    grid-area: price;
                }

                .product-banner__ctas {
                    grid-area: save;
                }

                .product-banner__save-icon {
                    border: 1px solid var(--br-primary);
                    width: 50px;
                    height: 50px;
                }

                .bg-transparent-black {
                    background-color: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
};

export default ProductBanner;
