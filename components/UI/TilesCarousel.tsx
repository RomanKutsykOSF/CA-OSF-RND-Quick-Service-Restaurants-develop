import SwiperCore, { Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/scrollbar";
import { useContext } from "react";
import { GlobalContext } from "context/global";

SwiperCore.use([Scrollbar]);

type TilesCarouselTile = {
    img: string;
    id: string;
    name: string;
};

export interface TilesCarouselData {
    tiles: TilesCarouselTile[];
    title: string;
}

export interface TilesCarouselProps extends TilesCarouselData {
    className?: string;
    slidesPerViewXs: number;
    slidesPerViewS: number;
    slidesPerViewMd: number;
    slidesPerViewLg: number;
    spaceBetween?: number;
}

const TilesCarousel = ({
    title,
    tiles,
    className,
    slidesPerViewXs,
    slidesPerViewS,
    slidesPerViewMd,
    slidesPerViewLg,
    spaceBetween = 28,
}: TilesCarouselProps): JSX.Element => {
    const globalContext = useContext(GlobalContext);

    return (
        <div className={`${className || ""} ${tiles ? "" : "hidden"}`}>
            <h3 className="mb-4 text-lg font-bold">{title}</h3>
            <Swiper
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
                spaceBetween={spaceBetween}
                scrollbar={{ draggable: true }}
            >
                {tiles?.map((tile) => {
                    const link = `/store/${tile.id}/products`;
                    return (
                        <SwiperSlide className={`pb-7 tiles-carousel__slide`} key={link}>
                            <Link href={link}>
                                <a className="flex flex-wrap justify-center">
                                    <Image
                                        className="w-full rounded-full"
                                        src={tile.img}
                                        layout="fixed"
                                        width={81}
                                        height={81}
                                    />
                                    <p className="product-name text-center text-sm font-semibold mt-4">{tile.name}</p>
                                </a>
                            </Link>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default TilesCarousel;
