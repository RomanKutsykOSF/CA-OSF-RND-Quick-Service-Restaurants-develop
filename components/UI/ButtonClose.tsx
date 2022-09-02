import React from "react";

interface ButtonCloseProps {
    className?: string;
    onClick?: React.FormEventHandler<HTMLButtonElement>;
}

const ButtonClose = ({ onClick }: ButtonCloseProps): JSX.Element => {
    return (
        <>
            <button
                className={`text-center py-2 px-5 rounded-3xl font-primary text-sm text-t-primary`}
                onClick={onClick}
            >
                <span className="float-right icon-cross" />
            </button>
        </>
    );
};

export default ButtonClose;
