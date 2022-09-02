import React from "react";
import Button from "components/UI/Button";
import KeyValueItem, { KeyValueItemItemProps } from "./KeyValueItem";

export interface AccountProfileTileProps {
    items: KeyValueItemItemProps[];
    editText: string;
    editLink: string;
}

const AccountProfileTile = ({ items, editText, editLink }: AccountProfileTileProps): JSX.Element => {
    const profileTileList = items.map((tileData, index) => {
        return (
            <div key={index} className={`${index == 3 ? "mt-12" : ""}`}>
                <KeyValueItem
                    name={tileData.name}
                    value={tileData.value}
                    showTopMargin={tileData.showTopMargin}
                ></KeyValueItem>
            </div>
        );
    });

    return (
        <div>
            {profileTileList}
            <Button variant="outline-custom" className="mt-6 mb-24" link={editLink}>
                {editText}
            </Button>
        </div>
    );
};

export default AccountProfileTile;
