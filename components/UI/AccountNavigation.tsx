import React from "react";
import Button from "components/UI/Button";
import Title from "components/UI/Title";
import AccountNavigationItem, { AccountNavigationItemProps } from "./AccountNavigationItem";

export interface AccountNavigation {
    title: string;
    items: AccountNavigationItemProps[];
    logoutText: string;
    logoutCallback: () => void;
}

const AccountNavigation = ({ title, items, logoutText, logoutCallback }: AccountNavigation): JSX.Element => {
    const slidesList = items.map((tileData, index) => {
        return (
            <div key={index}>
                <AccountNavigationItem title={tileData.title} link={tileData.link} isActive={tileData.isActive} />
            </div>
        );
    });

    return (
        <div>
            <Title type="h1" alignment="left">
                {title}
            </Title>
            <div className="text-center">
                {slidesList}
                <Button
                    variant="text-link"
                    className={`lg:mb-20 mt-3 w-full`}
                    onClick={logoutCallback}
                    customTextColorClass="text-t-secondary-2"
                >
                    {logoutText}
                </Button>
            </div>
        </div>
    );
};
export default AccountNavigation;
