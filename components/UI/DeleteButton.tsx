import React from "react";
import Button from "components/UI/Button";

interface DeleteButtonProps {
    onClick?: React.FormEventHandler<HTMLButtonElement>;
}

const AccountProfileTile = ({ onClick }: DeleteButtonProps): JSX.Element => {
    return (
        <Button variant="outline-custom" className="ml-2 my-3 px-2.5" onClick={onClick}>
            <i className="icon-trash text-sm text-t-primary"></i>
        </Button>
    );
};

export default AccountProfileTile;
