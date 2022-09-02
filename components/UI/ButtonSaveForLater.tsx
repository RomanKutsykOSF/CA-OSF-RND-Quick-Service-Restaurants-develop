import Button from "components/UI/Button";
import { ReactNode } from "react";

export interface backButtonProps {
    children: ReactNode;
    saveForLaterCallback: () => any;
}

const ButtonSaveForLater = ({ children, saveForLaterCallback }: backButtonProps): JSX.Element => {
    return (
        <Button type="button" variant="text-link" onClick={saveForLaterCallback}>
            {children}
        </Button>
    );
};

export default ButtonSaveForLater;
