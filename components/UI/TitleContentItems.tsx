import React from "react";

interface TitleContentItem {
    text: string;
    className?: string;
}

interface TitleContentItemsProps {
    className?: string;
    title?: string;
    items?: TitleContentItem[];
}

const TitleContentItems = ({ className, title, items }: TitleContentItemsProps): JSX.Element => {
    return (
        <section className={className}>
            <p className="font-primary text-lg text-t-primary font-bold mt-3">{title}</p>

            {items &&
                items?.length &&
                items?.map((item, index) => {
                    return (
                        <p
                            className={`font-primary text-sm text-t-primary mt-1${
                                className ? ` ${item.className}` : ""
                            }`}
                            key={index}
                        >
                            {item.text}
                        </p>
                    );
                })}
        </section>
    );
};

export default TitleContentItems;
