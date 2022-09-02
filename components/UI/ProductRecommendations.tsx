import SwiperCore, { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { useContext } from "react";
import { GlobalContext } from "context/global";
import ProductTile, { ProductTileProps } from "components/plp/productTile";
import "swiper/css";
import "swiper/css/scrollbar";

export interface ProductRecommendationsProps {
    className?: string;
    title: string;
    tiles: ProductTileProps[];
    isLoading?: boolean;
    productUnavailableText: string;
    slidesPerViewXs: number;
    slidesPerViewS: number;
    slidesPerViewMd: number;
    slidesPerViewLg: number;
    spaceBetween?: number;
}

SwiperCore.use([Scrollbar]);

const ProductRecommendations = ({
    className,
    title,
    tiles,
    isLoading,
    productUnavailableText,
    slidesPerViewXs,
    slidesPerViewS,
    slidesPerViewMd,
    slidesPerViewLg,
    spaceBetween = 28,
}: ProductRecommendationsProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <div className={`product-recommendation ${className || ""}`}>
            <h3 className="my-4 font-bold text-lg lg:text-2xl">{title}</h3>
            <Swiper
                spaceBetween={spaceBetween}
                scrollbar={{ draggable: true }}
                breakpoints={{
                    [globalContext.viewports.xSmall]: {
                        slidesPerView: slidesPerViewXs,
                    },
                    [globalContext.viewports.small]: {
                        slidesPerView: slidesPerViewS,
                    },
                    [globalContext.viewports.medium]: {
                        slidesPerView: slidesPerViewMd,
                    },
                    [globalContext.viewports.large]: {
                        slidesPerView: slidesPerViewLg,
                    },
                }}
            >
                {tiles.map((tileData) => {
                    return (
                        <SwiperSlide className={`pb-8`} key={tileData.id}>
                            <ProductTile
                                {...tileData}
                                isLoadingTile={isLoading}
                                isAvailableInStoreText={productUnavailableText}
                            />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default ProductRecommendations;
