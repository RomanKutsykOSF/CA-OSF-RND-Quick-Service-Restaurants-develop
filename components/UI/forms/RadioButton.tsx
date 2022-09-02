import React, { useState, useEffect, useRef, useContext } from "react";
import { RadioButtonContext } from "components/UI/forms/RadioButtonsGroup";

interface RadioButtonProps {
    variant?: "default" | "wheel";
    id: string;
    onChange?: React.FormEventHandler<HTMLInputElement>;
    onInput?: React.FormEventHandler<HTMLInputElement>;
    formHooksRegister?: any;
    label: string;
    subLabel?: string;
    error?: string;
    className?: string;
    value: string;
    icon?: string;
}

const RadioButton = ({
    id,
    onChange,
    onInput,
    formHooksRegister,
    label,
    subLabel,
    error,
    className,
    value,
    variant,
    icon,
}: RadioButtonProps): JSX.Element => {
    const chosenVariant = variant ? variant : "default";
    const [isActive, setIsActive] = useState(false);
    const radioButtonContext = useContext(RadioButtonContext);
    const { ref, ...rest } = formHooksRegister;
    const radioButton = useRef(null);
    const onChangeHandler = (ev): any => {
        if (radioButton?.current?.checked) {
            radioButtonContext.setActiveRadioId(radioButton?.current.id);
        }

        if (onChange) {
            onChange(ev);
        }
    };

    useEffect(() => {
        if (radioButton?.current?.checked) {
            radioButtonContext.setActiveRadioId(radioButton?.current.id);
        }

        if (radioButton?.current.id === radioButtonContext.activeRadioId) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [radioButtonContext, radioButtonContext.activeRadioId]);

    return (
        <>
            <div
                onChange={onChangeHandler}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                className={`w-full mt-4 radio-${chosenVariant} ${className ? className : ""} outline-none`}
            >
                <label
                    className={`flex relative cursor-pointer w-full ${
                        chosenVariant == "wheel" && "px-2 py-4"
                    } items-center ${
                        isActive && chosenVariant === "wheel" ? "bg-bgr-tertiary" : "bg-bgr-faded"
                    } rounded-xl shadow-sm`}
                    htmlFor={id}
                >
                    <input
                        id={id}
                        className="hidden"
                        onInput={onInput}
                        type="radio"
                        value={value}
                        ref={(e) => {
                            ref(e);
                            radioButton.current = e; // you can still assign to ref
                        }}
                        {...rest}
                    />

                    {chosenVariant === "wheel" && (
                        <span className="flex justify-center items-center">
                            <i className={`${icon} text-2xl ${isActive ? "text-t-tertiary" : ""}`}></i>
                        </span>
                    )}

                    {chosenVariant === "default" && (
                        <span className="flex justify-center items-center rounded-full border border-br-secondary w-5 h-5">
                            <div
                                className={`rounded-full bg-bgr-tertiary w-3 h-3 ${isActive ? "visible" : "hidden"}`}
                            />
                        </span>
                    )}

                    <div className="ml-2">
                        <p
                            className={`font-primary font-medium text-sm text-t-primary ${
                                isActive && chosenVariant === "wheel" ? "text-t-tertiary" : ""
                            }`}
                        >
                            {label}
                        </p>
                        {subLabel ? (
                            <p
                                className={`${
                                    isActive && chosenVariant === "wheel" ? "text-t-tertiary" : ""
                                } font-primary text-sm font-bold`}
                            >
                                {subLabel}
                            </p>
                        ) : (
                            ""
                        )}
                    </div>
                    {isActive && chosenVariant === "wheel" && (
                        <span className="flex ml-auto items-center rounded-full bg-bgr-primary border border-br-secondary">
                            <i className={`icon-check text-lg ${isActive ? "text-t-secondary-2" : ""}`}></i>
                        </span>
                    )}
                </label>
                {error ? <p className="error absolute leading-tight text-t-error -bottom-6">{error}</p> : ""}
            </div>
        </>
    );
};

export default RadioButton;
