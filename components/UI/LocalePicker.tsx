import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

interface LocalePickerProps {
    locales: string[];
    activeLocale: string;
    localesTextMap: {
        localeKeyTexts: Record<string, string>;
    };
}

const LocalePicker = ({ locales, activeLocale, localesTextMap }: LocalePickerProps): JSX.Element => {
    const router = useRouter();
    const otherLocales = locales?.filter((locale) => locale !== activeLocale);

    return (
        <Menu as="div" className="relative hidden lg:block text-left">
            <Menu.Button className="flex items-center text-t-tertiary w-full px-2 py-2">
                <Image src={`/images/${activeLocale}.png`} width={32} height={18} />
                <span className={`icon-chevron-down text-lg ml-2 inline-block text-t-primary`} />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute border border-t-primary z-20 right-0 mt-2 w-56 bg-bgr-primary rounded-xl shadow-lg">
                    {otherLocales?.map((locale) => {
                        const { pathname, query, asPath } = router;

                        return (
                            <Menu.Item key={locale}>
                                <Link href={{ pathname, query }} as={asPath} locale={locale}>
                                    <a className="flex items-center cursor-pointer px-4 py-2">
                                        <Image src={`/images/${locale}.png`} width={32} height={18} />
                                        <span className={`ml-2`}>{localesTextMap?.localeKeyTexts[locale]}</span>
                                    </a>
                                </Link>
                            </Menu.Item>
                        );
                    })}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default LocalePicker;
