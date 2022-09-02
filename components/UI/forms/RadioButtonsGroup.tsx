import React, { ReactNode, useState } from "react";

interface RadioButtonsGroupProps {
    children?: ReactNode;
}

export const RadioButtonContext = React.createContext({
    activeRadioId: "",
    setActiveRadioId: (id): any => {
        return id;
    },
});

const RadioButtonsGroup = ({ children }: RadioButtonsGroupProps): JSX.Element => {
    const [activeRadioId, setActiveRadioId] = useState("");
    return (
        <>
            <RadioButtonContext.Provider
                value={{
                    activeRadioId,
                    setActiveRadioId: (id) => {
                        setActiveRadioId(id);
                    },
                }}
            >
                {children}
            </RadioButtonContext.Provider>
        </>
    );
};

export default RadioButtonsGroup;
