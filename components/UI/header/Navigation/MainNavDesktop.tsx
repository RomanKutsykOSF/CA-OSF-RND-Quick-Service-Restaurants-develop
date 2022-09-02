import Image from "next/image";
import Link from "next/link";
import { getNavLinkVisibility, Logo, MenuLink } from "./Navigation";

interface MainNavDesktopProps {
    links: MenuLink[];
    logo: Logo;
    isUserLoggedIn: boolean;
}

const MainNavDesktop = ({ links, logo, isUserLoggedIn }: MainNavDesktopProps): JSX.Element => {
    return (
        <>
            <Link href={logo.logoRedirectUrl}>
                <a className="hidden w-32 lg:block mr-auto">
                    <Image
                        width={137}
                        height={18}
                        src={logo.logoImgPath || "/images/no-image-icon.png"}
                        alt="site-logo"
                    />
                </a>
            </Link>
            <ul className="list-none hidden lg:flex">
                {links?.map((item, i) => {
                    return (
                        <li className={`${getNavLinkVisibility(item, isUserLoggedIn)}`} key={i}>
                            <Link href={item.link}>
                                <a className={`p-5 text-sm font-medium text-t-primary`}>{item.name}</a>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default MainNavDesktop;
