import React, { ReactNode, useState } from "react";

interface PickerRadioButtonsGroupProps {
    children?: ReactNode;
}

export const PickerRadioButtonContext = React.createContext({
    activeRadioId: "",
    setActiveRadioId: (id): any => {
        return id;
    },
});

const PickerRadioButtonsGroup = ({ children }: PickerRadioButtonsGroupProps): JSX.Element => {
    const [activeRadioId, setActiveRadioId] = useState("");
    return (
        <>
            <PickerRadioButtonContext.Provider
                value={{
                    activeRadioId,
                    setActiveRadioId: (id) => {
                        setActiveRadioId(id);
                    },
                }}
            >
                {children}
            </PickerRadioButtonContext.Provider>
        </>
    );
};

export default PickerRadioButtonsGroup;
