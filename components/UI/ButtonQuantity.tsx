import React, { ReactNode } from "react";

interface ButtonProps {
    variant?: "quantity-selector" | "quantity-selector--remove";
    cssIconClass?: string;
    className?: string;
    onClick?: React.FormEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children?: ReactNode;
}

const ButtonQuantity = ({
    onClick,
    cssIconClass,
    children,
    variant,
    disabled,
    className,
}: ButtonProps): JSX.Element => {
    const iconClassList = ["float-right"];
    if (cssIconClass) {
        iconClassList.push(cssIconClass);
    }

    return (
        <>
            <button
                className={`text-center py-2 px-5 rounded-3xl font-primary text-sm text-t-tertiary lg:mx-1 ${className} ${variant}`}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
                {cssIconClass ? <span className={iconClassList.join(" ")} /> : null}
            </button>

            <style jsx>{`
                button {
                    transition: 250ms all;
                    font-weight: bold;
                    color: var(--t-tertiary);
                    border: 1px solid transparent;
                }

                button:disabled {
                    cursor: auto;
                    background: var(--bgr-tertiary-faded);
                    border: 1px solid transparent;
                    color: var(--t-disabled-2);
                }

                .quantity-selector {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0;
                    min-width: 30px;
                    height: 30px;
                    border-radius: 15px;
                    color: var(--t-secondary-2);
                    background-color: var(--bgr-tertiary-faded);
                }

                .quantity-selector:disabled {
                    background-color: var(--br-disabled);
                    color: var(--t-disabled);
                }

                .quantity-selector--remove {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 10px;
                    min-width: 30px;
                    height: 30px;
                    border-radius: 15px;
                    color: var(--t-secondary-2);
                    background-color: var(--bgr-tertiary-faded);
                }

                .quantity-selector--remove:disabled {
                    background-color: var(--br-disabled);
                    color: var(--t-disabled);
                }
            `}</style>
        </>
    );
};

export default ButtonQuantity;
