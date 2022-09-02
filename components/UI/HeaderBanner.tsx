import React, { ReactNode } from "react";
import Image from "next/image";
import CenterContentWrapper from "components/UI/layoutControls/CenterContentWrapper";

interface HeaderBannerProps {
    imgDesktopUrl: string;
    imgMobileUrl: string;
    title: string;
    subTitle: string;
    children?: ReactNode;
}

const HeaderBanner = ({ imgMobileUrl, imgDesktopUrl, title, subTitle, children }: HeaderBannerProps): JSX.Element => {
    return (
        <>
            <div className="relative header-banner">
                <div className="lg:hidden">
                    <Image src={imgMobileUrl} layout="responsive" width={375} height={163} />
                </div>
                <div className="hidden lg:block">
                    <Image src={imgDesktopUrl} layout="responsive" width={1440} height={218} />
                </div>
                <div className="absolute inset-0 bg-transparent-black">
                    <CenterContentWrapper className="h-full">
                        <div className="h-full flex flex-wrap items-end py-4 lg:py-5">
                            <div className="flex items-center w-full">
                                <div className="mr-auto">
                                    <h2 className="text-t-tertiary font-bold text-2xl lg:text-3xl header-banner__title">
                                        {title}
                                    </h2>
                                    <p className="lg:hidden text-t-tertiary text-sm font-bold">{subTitle}</p>
                                </div>
                                <p className="hidden lg:block text-t-tertiary text-sm font-bold">{subTitle}</p>
                                {!!children && (
                                    <div className="header-banner__right-bottom-slot lg:ml-4">{children}</div>
                                )}
                            </div>
                        </div>
                    </CenterContentWrapper>
                </div>
            </div>
            <style jsx>{`
                .header-banner__sub-title {
                    font-family: var(--font-family-primary);
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 24px;
                }

                .bg-transparent-black {
                    background-color: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </>
    );
};

export default HeaderBanner;
