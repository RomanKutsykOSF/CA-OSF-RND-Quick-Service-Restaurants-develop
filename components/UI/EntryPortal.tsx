import React from "react";
import Button from "components/UI/Button";
import Title from "components/UI/Title";
import css from "styled-jsx/css";

export interface EntryPortalProps {
    title: string;
    subtitle1: string;
    subtitle2: string;
    btn1Text: string;
    btn2Text: string;
    btn3Text: string;
    btn1Link: string;
    btn2Link: string;
    btn3Link: string;
}

const EntryPortal = ({
    title,
    subtitle1,
    subtitle2,
    btn1Text,
    btn2Text,
    btn3Text,
    btn1Link,
    btn2Link,
    btn3Link,
}: EntryPortalProps): JSX.Element => {
    const { className: backCtaClass, styles: backCtaClassStyles } = css.resolve`
        .entry-portal__back-cta {
            color: var(--t-secondary-2);
            text-decoration: underline;
        }
    `;

    return (
        <div className="mt-10 lg:mt-12 mx-auto flex flex-col align-center entry-portal">
            <Title type="h1">{title}</Title>
            <div className="mx-auto entry-portal__content">
                <p className="mb-2 text-center text-sm">{subtitle1}</p>
                <Button variant="primary" className="w-full" link={btn1Link}>
                    {btn1Text}
                </Button>
                <hr className="my-4" />
                <p className="mb-2 text-center text-sm">{subtitle2}</p>
                <Button variant="outline-custom" className="mb-4 w-full" link={btn2Link}>
                    {btn2Text}
                </Button>
                <Button
                    variant="text-link"
                    className={`mb-20 w-full entry-portal__back-cta ${backCtaClass}`}
                    link={btn3Link}
                >
                    {btn3Text}
                </Button>
            </div>
            <style jsx>{`
                .entry-portal__content {
                    width: 340px;
                }
            `}</style>
            {backCtaClassStyles}
        </div>
    );
};

export default EntryPortal;
