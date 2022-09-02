import React, { ReactNode, useEffect } from "react";
import Title from "components/UI/Title";

interface CheckoutAccordionProps {
    title: string;
    editBtnText: string;
    isOpen?: boolean;
    canBeOpened: boolean;
    canBeClosed: boolean;
    closedTabContent?: JSX.Element;
    children: ReactNode;
    className?: string;
    openSetter: (isOpen) => any;
}

const CheckoutAccordion = ({
    title,
    editBtnText,
    isOpen,
    children,
    canBeOpened,
    canBeClosed,
    closedTabContent,
    className,
    openSetter,
}: CheckoutAccordionProps): JSX.Element => {
    const toggleIsOpen = (): any => {
        if (isOpen) {
            canBeClosed && openSetter(false);
        } else {
            canBeOpened && openSetter(true);
        }
    };

    useEffect(() => {
        !canBeClosed && openSetter(true);
        !canBeOpened && openSetter(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canBeOpened, canBeClosed]);

    useEffect(() => {
        openSetter(isOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <>
            <section className={className}>
                <button
                    className="flex justify-between w-full h-12 items-center"
                    type="button"
                    onClick={toggleIsOpen}
                    disabled={!canBeOpened ? true : false}
                >
                    <Title alignment="left" type="h2">
                        {title}
                    </Title>
                    {!isOpen && canBeOpened ? (
                        <span className="font-primary underline text-sm text-t-secondary-2">{editBtnText}</span>
                    ) : (
                        ""
                    )}
                </button>
                <div className={`mt-4 ${isOpen ? "hidden" : canBeOpened ? "" : "hidden"}`}>
                    {closedTabContent ? closedTabContent : ""}
                </div>
                <div className={`mt-4 ${!isOpen && "hidden"}`}>{children}</div>
            </section>
            <style jsx>{`
                button {
                    border-bottom: 1px solid var(--br-disabled);
                }
                button:disabled {
                    background-color: var(--bgr-faded);
                    border-bottom: 0;
                    padding: 0 20px;
                }
            `}</style>
        </>
    );
};

export default CheckoutAccordion;
