import ConditionalWrapper from "components/Utils/ConditionalWrapper";
import Link from "next/link";
import React, { ReactNode } from "react";

export type linkRoute = {
    [key: string]: string;
};

interface ButtonProps {
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "outline-custom" | "text-link" | "text-link-underline" | "close";
    cssIconClass?: string;
    className?: string;
    onClick?: React.FormEventHandler<HTMLButtonElement>;
    link?: string;
    disabled?: boolean;
    children?: ReactNode;
    customTextColorClass?: string;
    linkQueryParams?: linkRoute;
    isLoading?: boolean;
}
const Button = ({
    type,
    onClick,
    disabled,
    cssIconClass,
    children,
    variant,
    link,
    className,
    customTextColorClass,
    linkQueryParams,
    isLoading,
}: ButtonProps): JSX.Element => {
    const iconClassList = ["float-right"];

    if (cssIconClass) {
        iconClassList.push(cssIconClass);
    }
    return (
        <>
            <ConditionalWrapper
                condition={!!link}
                wrapper={(_children) => (
                    <Link
                        href={{
                            pathname: link,
                            query: linkQueryParams || {},
                        }}
                    >
                        {_children}
                    </Link>
                )}
            >
                <button
                    disabled={disabled}
                    className={`text-center py-2 px-5 rounded-3xl font-primary text-sm ${
                        customTextColorClass ? customTextColorClass : "text-t-tertiary"
                    } ${variant} ${className} ${isLoading ? "loading" : ""}`}
                    onClick={onClick}
                    type={type}
                >
                    {children}
                    {cssIconClass ? <span className={iconClassList.join(" ")} /> : null}
                </button>
            </ConditionalWrapper>
            <style jsx>{`
                button {
                    transition: 250ms all;
                    font-weight: bold;
                    border: 1px solid transparent;
                    position: relative;
                }

                button:disabled {
                    cursor: auto;
                    background: var(--bgr-tertiary-faded);
                    border: 1px solid transparent;
                    color: var(--t-disabled-2);
                }

                .primary {
                    background: var(--bgr-tertiary);
                    border: 1px solid transparent;
                    font-weight: bold;
                }

                .primary:hover {
                    filter: brightness(85%);
                }

                .outline-custom {
                    color: var(--t-primary);
                    background: var(--bgr-primary);
                    border-color: var(--br-primary);
                }
                .text-link {
                    padding: 0;
                }

                .text-link-underline {
                    padding: 0;
                    text-decoration: underline;
                }
                .close {
                    padding: 0;
                    color: var(--t-primary);
                }

                button:not(disabled).outline:hover {
                    background: var(--bgr-tertiary);
                    color: var(--t-tertiary);
                    filter: brightness(85%);
                }

                @keyframes button-anim {
                    from {
                        transform: rotate(0);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                button.loading {
                    color: transparent;
                }

                button.loading::after {
                    content: "";
                    display: block;
                    width: 1.2em;
                    height: 1.2em;
                    position: absolute;
                    left: calc(50% - 0.75em);
                    top: calc(50% - 0.75em);
                    border: 0.15em solid transparent;
                    border-right-color: white;
                    border-radius: 50%;
                    animation: button-anim 0.7s linear infinite;
                    opacity: 0;
                }

                button.loading::after {
                    opacity: 1;
                }
            `}</style>
        </>
    );
};

export default Button;
