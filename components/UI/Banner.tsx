import Image from "next/image";

interface BannerProps {
    title: string;
    bannerImgDesktopUrl: string;
    bannerImgDesktopWidth: number;
    bannerImgDesktopHeight: number;
    bannerImgMobileUrl: string;
    bannerImgMobileWidth: number;
    bannerImgMobileHeight: number;
}

const Banner = ({
    title,
    bannerImgDesktopUrl,
    bannerImgDesktopWidth,
    bannerImgDesktopHeight,
    bannerImgMobileUrl,
    bannerImgMobileWidth,
    bannerImgMobileHeight,
}: BannerProps): JSX.Element => {
    return (
        <>
            <section className="app-store-search relative w-full">
                <div className="relative w-full hidden lg:block">
                    <Image
                        src={bannerImgDesktopUrl}
                        layout="responsive"
                        width={bannerImgDesktopWidth}
                        height={bannerImgDesktopHeight}
                    />
                </div>
                <div className="relative w-full lg:hidden">
                    <Image
                        src={bannerImgMobileUrl}
                        layout="responsive"
                        width={bannerImgMobileWidth}
                        height={bannerImgMobileHeight}
                    />
                </div>
                <div className="absolute top-0 left-0 flex flex-col w-full h-full items-center justify-center">
                    <div>
                        <h1 className="font-primary lg:py-8 text-xxl lg:text-2lg text-t-tertiary">{title}</h1>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Banner;
