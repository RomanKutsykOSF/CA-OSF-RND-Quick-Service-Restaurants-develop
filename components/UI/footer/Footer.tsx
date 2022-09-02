import React from "react";
import CenterContentWrapper from "../layoutControls/CenterContentWrapper";
import FooterColumnItem from "components/UI/footer/FooterColumnItem";
import FooterColumn from "components/UI/footer/FooterColumn";

export interface FooterIcon {
    url: string;
    img: string;
}

interface FooterColumnItem {
    text: string;
    url: string;
}

export interface FooterColumn {
    items: FooterColumnItem[];
}

interface FooterProps {
    logo: string;
    copyright: string;
    columns?: FooterColumn[];
    icons?: FooterIcon[];
    disableFooterTopMargin?: boolean;
}

const Footer = ({ logo, copyright, columns, disableFooterTopMargin, icons }: FooterProps): JSX.Element => {
    return (
        <>
            <footer className={`${disableFooterTopMargin ? "" : "mt-5"}`}>
                <div className="bg-bgr-secondary">
                    <div className={`pt-8 pb-24`}>
                        <CenterContentWrapper>
                            <div className={`lg:grid lg:grid-cols-12`}>
                                <div className="lg:col-span-3">
                                    <img className="w-44" src={logo} alt="" />
                                </div>
                                <div className={"mt-6 lg:mt-0 lg:col-span-9 grid md:grid-cols-4 gap-4"}>
                                    {columns?.map((column, i) => {
                                        return (
                                            <FooterColumn key={i}>
                                                {column?.items?.map((columnItem) => {
                                                    return (
                                                        <FooterColumnItem
                                                            key={columnItem.text}
                                                            text={columnItem.text}
                                                            url={columnItem.url}
                                                        />
                                                    );
                                                })}
                                            </FooterColumn>
                                        );
                                    })}
                                </div>
                            </div>
                            <div
                                className={`mt-10 border-solid border-t-2 border-br-secondary pt-8 lg:flex lg:items-center`}
                            >
                                <div className="flex">
                                    {icons &&
                                        icons.map((icon) => {
                                            return (
                                                <a key={icon.url} href={icon.url} rel="noreferrer" target={"_blank"}>
                                                    <i
                                                        className={`${icon.img} block text-t-tertiary rounded-full border-br-secondary border-solid border-2 text-xl mr-4 p-2`}
                                                    />
                                                </a>
                                            );
                                        })}
                                </div>
                                <p className={`text-t-tertiary w-100 text-xs mt-4 lg:mt-0`}>{copyright}</p>
                            </div>
                        </CenterContentWrapper>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
