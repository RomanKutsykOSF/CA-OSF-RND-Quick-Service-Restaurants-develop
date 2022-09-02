import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";
import viewports from "config/viewports.json";
import MenuTilesCarouselTile, { MenuTilesCarouselTileProps } from "./MenuTilesCarouselTile";
import "swiper/css";

interface MenuTilesCarouselProps {
    title: string;
    linkPath: string;
    linkText: string;
    slides: MenuTilesCarouselTileProps[];
}

const MenuTilesCarousel = ({ title, linkPath, linkText, slides }: MenuTilesCarouselProps): JSX.Element => {
    const sliderSelectorRef = useRef(null);
    const mainSliderRef = useRef<Swiper>(null);
    const [swiperState, setSwiperState] = useState(false);

    const initializeSwiper = (): void => {
        mainSliderRef.current = new Swiper(sliderSelectorRef.current, {
            breakpoints: {
                320: {
                    slidesPerView: 1.3,
                    spaceBetween: 16,
                },
                768: {
                    slidesPerView: 2.3,
                    spaceBetween: 16,
                },
            },
        });
    };

    const destroySlider = (): void => {
        mainSliderRef.current.destroy(true, true);
    };

    useEffect(() => {
        const mobileMq = window.matchMedia(`(max-width: ${viewports.medium}px)`);

        mobileMq.addEventListener("change", (event) => {
            if (!event.matches) {
                if (swiperState) {
                    setSwiperState(false);
                    destroySlider();
                }
            } else {
                setSwiperState(true);
            }
        });

        if (mobileMq.matches) {
            setSwiperState(true);

            if (swiperState) {
                initializeSwiper();
            }
        }

        return () => {
            if (swiperState) {
                destroySlider();
                setSwiperState(false);
            }
        };
    }, [swiperState]);

    return (
        <>
            <section className="mt-12 mb-24">
                <CenterContentWrapper>
                    <div className="flex justify-between items-center my-5">
                        <h1 className="text-xl lg:text-xxl font-primary font-bold text-t-primary">{title}</h1>
                        <div className="hidden md:flex items-center">
                            <Link href={linkPath}>
                                <a className="underline text-t-secondary text-sm font-semibold mr-4">{linkText}</a>
                            </Link>
                        </div>
                    </div>

                    <div ref={sliderSelectorRef} className={swiperState ? "swiper-container" : ""}>
                        <div className={swiperState ? "swiper-wrapper" : "grid grid-cols-3 gap-8"}>
                            {slides
                                ? slides.map((slide, i) => (
                                      <div key={i} className={swiperState ? "swiper-slide" : ""}>
                                          <MenuTilesCarouselTile
                                              imgPath={slide.imgPath}
                                              linkPath={slide.linkPath}
                                              linkText={slide.linkText}
                                              title={slide.title}
                                          />
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                </CenterContentWrapper>
            </section>

            <style jsx>{`
                i:before {
                    margin: 0;
                    width: 100%;
                }

                i {
                    font-size: 28px;
                }
            `}</style>
        </>
    );
};

export default MenuTilesCarousel;
