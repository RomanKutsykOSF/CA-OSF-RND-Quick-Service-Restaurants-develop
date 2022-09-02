import Image from "next/image";
import React from "react";
import Button from "components/UI/Button";

export interface AdvertisementBannerProps {
    imgMobile: string;
    imgDesktop: string;
    title: string;
    subTitle: string;
    btnText: string;
    link: string;
    className?: string;
}

const AdvertisementBanner = ({
    imgMobile,
    imgDesktop,
    title,
    subTitle,
    btnText,
    link,
    className,
}: AdvertisementBannerProps): JSX.Element => {
    return (
        <div className={`relative rounded-3xl ${className || ""}`}>
            <div className="lg:hidden">
                <Image src={imgMobile} className="rounded-3xl" layout="responsive" width={344} height={193} />
            </div>
            <div className="hidden lg:block">
                <Image src={imgDesktop} className="rounded-3xl" layout="responsive" width={1183} height={221} />
            </div>
            <div className="absolute inset-0 px-8 lg:px-12 flex flex-col justify-center items-start">
                <h3 className="hidden lg:block font-bold font-primary text-t-tertiary text-lg">{title}</h3>
                <p className="mb-4 font-bold text-2xl text-t-tertiary">{subTitle}</p>
                <Button variant="primary" link={link}>
                    {btnText}
                </Button>
            </div>
        </div>
    );
};

export default AdvertisementBanner;
