import React, { useState } from "react";
import Button from "components/UI/Button";
import { Address } from "interfaces/checkout";
import TileContentItems from "./TitleContentItems";
import ModalPopup, { PopupProps } from "components/UI/ModalPopup";
import DeleteButton from "components/UI/DeleteButton";

export interface AccountAddressTileProps extends Address {
    editBtnText: string;
    editBtnLink: string;
    makePrimaryBtnText: string;
    makePrimaryBtnFunction: (addressId: string) => any;
    deletePopupProps: PopupProps;
}

const AccountAddressTile = ({
    addressName,
    firstName,
    lastName,
    address1,
    address2,
    state,
    city,
    country,
    makePrimaryBtnText,
    editBtnText,
    editBtnLink,
    id,
    phone,
    isPrimary,
    makePrimaryBtnFunction,
    deletePopupProps: { title, text, noText, yesText, actionFunction },
}: AccountAddressTileProps): JSX.Element => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    return (
        <div className="mt-4">
            <TileContentItems
                title={addressName}
                items={[
                    { text: firstName + " " + lastName },
                    { text: address1 },
                    { text: address2 || "" },
                    { text: city + ", " + country },
                    { text: state },
                    { text: phone },
                ]}
            ></TileContentItems>
            <Button
                className="mr-3"
                variant="primary"
                disabled={isPrimary}
                onClick={() => {
                    makePrimaryBtnFunction(id);
                }}
            >
                {makePrimaryBtnText}
            </Button>
            <span>
                <Button variant="outline-custom" className="mx-2 my-3" link={editBtnLink}>
                    {editBtnText}
                </Button>
                <DeleteButton
                    onClick={() => {
                        setIsPopupVisible(true);
                    }}
                ></DeleteButton>
            </span>
            <ModalPopup
                title={title}
                text={text}
                yesText={yesText}
                noText={noText}
                isPopupVisible={isPopupVisible}
                onClose={() => setIsPopupVisible(false)}
                actionFunction={() => {
                    actionFunction(id);
                    setIsPopupVisible(false);
                }}
            />
        </div>
    );
};

export default AccountAddressTile;
