import Backdrop from "components/UI/Backdrop";
import LocalePickerMobile from "components/UI/LocalePickerMobile";
import SlideDrawer from "components/UI/SlideDrawer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getNavLinkVisibility, Logo, MenuLink } from "./Navigation";

interface MainNavMobileProps {
    links: MenuLink[];
    logo: Logo;
    isUserLoggedIn: boolean;
    locales: string[];
    activeLocale: string;
    localesTextMap: {
        localeKeyTexts: Record<string, string>;
    };
    changeLocationText: string;
}

const MainNavMobile = ({
    links,
    logo,
    isUserLoggedIn,
    localesTextMap,
    locales,
    activeLocale,
    changeLocationText,
}: MainNavMobileProps): JSX.Element => {
    const [drawer, setDrawer] = useState(false);

    return (
        <>
            <i
                tabIndex={0}
                role="button"
                onKeyDown={(e) => e.key === "Enter" && setDrawer(!drawer)}
                onClick={() => setDrawer(!drawer)}
                className={`icon-menu text-t-primary text-xl mr-2 cursor-pointer lg:hidden`}
            />
            <Link href={logo.logoRedirectUrl}>
                <a className="lg:hidden h-5">
                    <Image
                        width={128}
                        height={18}
                        src={logo.logoImgPath || "/images/no-image-icon.png"}
                        alt="site-logo"
                    />
                </a>
            </Link>

            <SlideDrawer
                onKeyDown={(e) => e.key === "Enter" && setDrawer(!drawer)}
                onClick={() => setDrawer(!drawer)}
                show={drawer}
            >
                <ul className="mt-2">
                    {links?.map((item, i) => {
                        return (
                            <li
                                className={`w-full py-3 border-t-2 border-solid border-br-secondary ${getNavLinkVisibility(
                                    item,
                                    isUserLoggedIn
                                )}`}
                                key={i}
                            >
                                <Link href={item.link}>
                                    <a className={`text-lg font-semibold text-t-primary py-3`}>{item.name}</a>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <LocalePickerMobile
                    changeLocation={changeLocationText}
                    localesTextMap={localesTextMap}
                    locales={locales}
                    activeLocale={activeLocale}
                />
            </SlideDrawer>
            {drawer ? <Backdrop /> : null}
            <style jsx>{`
                i:before {
                    display: block;
                }
            `}</style>
        </>
    );
};

export default MainNavMobile;
