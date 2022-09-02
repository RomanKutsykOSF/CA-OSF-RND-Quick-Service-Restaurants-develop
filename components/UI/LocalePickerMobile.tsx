import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import SlideDrawer from "components/UI/SlideDrawer";
import { useState } from "react";

interface LocalePickerMobileProps {
    locales: string[];
    activeLocale: string;
    changeLocation: string;
    localesTextMap: {
        localeKeyTexts: Record<string, string>;
    };
}

const LocalePickerMobile = ({
    changeLocation,
    localesTextMap,
    locales,
    activeLocale,
}: LocalePickerMobileProps): JSX.Element => {
    const router = useRouter();
    const otherLocales = locales?.filter((locale) => locale !== activeLocale);
    const [drawer, setDrawer] = useState(false);

    return (
        <div>
            <div>
                <button className="flex items-center text-t-tertiary focus:outline-none w-full py-2">
                    <Image src={`/images/${activeLocale}.png`} width={32} height={18} />
                    <span
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setDrawer(!drawer)}
                        onClick={() => setDrawer(!drawer)}
                        className="text-t-primary ml-2 cursor-pointer"
                    >
                        {changeLocation}
                    </span>
                </button>
            </div>
            <SlideDrawer
                onKeyDown={(e) => e.key === "Enter" && setDrawer(!drawer)}
                onClick={() => setDrawer(!drawer)}
                show={drawer}
            >
                {otherLocales?.map((locale) => {
                    const { pathname, query, asPath } = router;
                    return (
                        <Link key={locale} href={{ pathname, query }} as={asPath} locale={locale}>
                            <a className="flex items-center cursor-pointer px-4 py-4">
                                <Image src={`/images/${locale}.png`} width={32} height={18} />
                                <span className={`ml-2 text-t-primary`}>{localesTextMap?.localeKeyTexts[locale]}</span>
                            </a>
                        </Link>
                    );
                })}
            </SlideDrawer>
        </div>
    );
};

export default LocalePickerMobile;
