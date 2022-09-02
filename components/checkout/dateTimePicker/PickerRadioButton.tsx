import React, { useState, useEffect, useRef, useContext } from "react";
import { PickerRadioButtonContext } from "./PickerRadioButtonsGroup";

interface PickerRadioButtonProps {
    variant?: "default";
    id: string;
    onChange?: React.FormEventHandler<HTMLInputElement>;
    onInput?: React.FormEventHandler<HTMLInputElement>;
    formHooksRegister?: any;
    label: string;
    className?: string;
    value: string;
    isAvailable: boolean;
}

const PickerRadioButton = ({
    id,
    onChange,
    onInput,
    formHooksRegister,
    label,
    className,
    value,
    variant,
    isAvailable,
}: PickerRadioButtonProps): JSX.Element => {
    const chosenVariant = variant ? variant : "default";
    const [isActive, setIsActive] = useState(false);
    const radioButtonContext = useContext(PickerRadioButtonContext);
    const { ref, ...rest } = formHooksRegister;
    const radioButton = useRef(null);
    const onChangeHandler = (ev): any => {
        if (radioButton?.current?.checked && isAvailable) {
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
                className={`w-full mt-4 date-time-picker-radio-${chosenVariant} ${
                    className ? className : ""
                } outline-none`}
            >
                <label className={`flex relative cursor-pointer w-full items-center rounded-xl`} htmlFor={id}>
                    <input
                        disabled={!isAvailable}
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

                    <span className="flex justify-center items-center rounded-full border border-br-secondary w-5 h-5">
                        <div
                            className={`rounded-full bg-bgr-tertiary w-3 h-3 ${isActive ? "visible" : "hidden"}`}
                        ></div>
                    </span>

                    <div className="ml-4">
                        <p
                            className={`font-primary font-medium text-sm text-t-primary ${
                                !isAvailable && "text-t-disabled"
                            }`}
                        >
                            {label}
                        </p>
                    </div>
                </label>
            </div>
        </>
    );
};

export default PickerRadioButton;
