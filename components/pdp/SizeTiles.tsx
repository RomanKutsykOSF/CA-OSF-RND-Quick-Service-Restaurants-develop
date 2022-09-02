import { Swiper, SwiperSlide } from "swiper/react";
import css from "styled-jsx/css";
import { useContext } from "react";
import { GlobalContext } from "context/global";
import SizeTile, { SizeTileProps } from "components/pdp/SizeTile";
import "swiper/css";
import "swiper/css/scrollbar";

export interface SizeTilesProps {
    className?: string;
    title: string;
    tiles: SizeTileProps[];
}

const ProductRecommendations = ({ className, title, tiles }: SizeTilesProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);
    // to style nested SwiperSlide component from the parent
    const { className: slideClass, styles: slideStyles } = css.resolve`
        .size-tiles__slide {
            width: 50vw;
        }

        @media (min-width: ${globalContext.viewports.large}px) {
            .size-tiles__slide {
                width: auto;
            }
        }
    `;

    const { className: sliderClass, styles: sliderStyles } = css.resolve`
        .swiper-container {
            overflow: visible;
        }

        @media (min-width: ${globalContext.viewports.large}px) {
            .swiper-container {
                overflow: hidden;
            }
        }
    `;
    const slidesList =
        tiles?.map((tileData) => {
            return (
                <SwiperSlide className={`size-tiles__slide ${slideClass}`} key={tileData.title}>
                    <SizeTile {...tileData} />
                </SwiperSlide>
            );
        }) ?? null;

    return (
        <div className={`my-4 product-recommendation ${className || ""}`}>
            <h3 className="mb-2 font-bold text-lg lg:text-2xl">{title}</h3>
            <Swiper
                className={sliderClass}
                slidesPerView="auto"
                spaceBetween={10}
                breakpoints={{
                    [globalContext.viewports.large]: {
                        slidesPerView: 3,
                    },
                }}
            >
                {slidesList}
            </Swiper>
            {sliderStyles}
            {slideStyles}
        </div>
    );
};

export default ProductRecommendations;
