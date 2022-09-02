import React from "react";

interface InputProps {
    type?: "text" | "number" | "password" | "hidden" | "email" | "tel";
    id: string;
    value?: string;
    readOnly?: boolean;
    placeholder?: string;
    onChange?: React.FormEventHandler<HTMLInputElement>;
    onInput?: React.FormEventHandler<HTMLInputElement>;
    formHooksRegister?: any;
    label?: string;
    showLabelVisually?: boolean;
    error?: string;
    className?: string;
    isValidated: boolean;
    isRequired?: boolean;
    inputInfo?: string;
}

const Input = ({
    type,
    id,
    value,
    placeholder,
    onChange,
    onInput,
    formHooksRegister,
    label,
    readOnly,
    error,
    className,
    isValidated,
    isRequired,
    inputInfo,
}: InputProps): JSX.Element => {
    const inputAttrs = {
        id,
        type,
        value,
        placeholder,
        onChange,
        onInput,
    };

    return (
        <>
            <div className={`relative mt-6 input-${type} ${className ? className : ""}`}>
                {label ? (
                    <label htmlFor={id} className="font-primary font-medium text-t-primary">
                        {label}
                        {isRequired ? <span className="font-primary text-lg text-t-error ml-1">*</span> : ""}
                    </label>
                ) : (
                    ""
                )}
                <input
                    readOnly={readOnly}
                    className={`w-full rounded-lg h-10 mt-1 text-sm py-4 pr-10 pl-4 border-2 focus:outline-none focus:border-br-disabled text-t-secondary  ${
                        isValidated && error
                            ? "border-t-error"
                            : isValidated && !error
                            ? "border-br-primary"
                            : "border-br-secondary"
                    }`}
                    {...inputAttrs}
                    {...formHooksRegister}
                />
                {inputInfo && !error && !isValidated && (
                    <p className="font-primary text-xs icon-info mt-2">{inputInfo}</p>
                )}
                {error ? (
                    <p className="error absolute leading-tight text-t-error -bottom-6">{error}</p>
                ) : (
                    <i
                        className={`icon-check m-auto text-right mr-1.5 -mt-9 text-xl text-t-secondary-2  ${
                            isValidated && !error ? "block" : "hidden"
                        }`}
                    />
                )}
            </div>
            <style jsx>{`
                input[readOnly] {
                    background-color: var(--bgr-faded);
                }

                .label-text::after {
                    content: "*";
                    color: var(--t-error);
                    font-size: 16px;
                    margin: 0px 2px;
                }

                .icon-info::before {
                    margin-right: 5px;
                }
            `}</style>
        </>
    );
};

export default Input;
