import React, { useState, useEffect, useRef } from "react";

interface CheckboxProps {
    id: string;
    value?: string;
    onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    defaultChecked?: boolean;
    formHooksRegister?: any;
    label: string;
    error?: string;
    className?: string;
}

const Checkbox = ({
    id,
    value,
    onChange,
    onInput,
    formHooksRegister,
    label,
    error,
    className,
    defaultChecked,
}: CheckboxProps): JSX.Element => {
    const [isActive, setIsActive] = useState(false);
    const checkboxRef = useRef(null);
    const labelRef = useRef(null);
    const { ref, ...rest } = formHooksRegister;
    const inputAttrs = {
        id,
        value,
        onInput,
    };
    const onChangeHandler = (ev): any => {
        if (checkboxRef?.current?.checked) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
        if (onChange) {
            onChange(ev);
        }
    };

    const triggerLabelClick = (): any => {
        labelRef.current.click();
    };

    useEffect(() => {
        if (checkboxRef?.current?.checked) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [rest]);

    return (
        <>
            <div onChange={onChangeHandler} className={`flex mt-6 ${className ? className : ""}`}>
                <input
                    defaultChecked={defaultChecked}
                    type="checkbox"
                    className="hidden"
                    {...inputAttrs}
                    {...formHooksRegister}
                    ref={(e) => {
                        ref(e);
                        checkboxRef.current = e; // you can still assign to ref
                    }}
                    {...rest}
                />
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        title={label}
                        className="flex bg-bgr-tertiary w-5 h-5 items-center justify-center rounded-md cursor-pointer"
                        onClick={triggerLabelClick}
                    >
                        <i className={`${isActive ? "icon-check" : ""} text-t-tertiary text-sm`} />
                    </button>
                    <label
                        className="cursor-pointer ml-4 font-primary text-sm text-t-primary"
                        htmlFor={id}
                        ref={labelRef}
                    >
                        {label}
                    </label>
                </div>
                {error ? <p className="error absolute leading-tight text-t-error -bottom-6">{error}</p> : ""}
            </div>
            <style jsx>{`
                .label-text::after {
                    content: "*";
                    color: var(--t-error);
                    font-size: 16px;
                    margin: 0px 2px;
                }
            `}</style>
        </>
    );
};

export default Checkbox;
