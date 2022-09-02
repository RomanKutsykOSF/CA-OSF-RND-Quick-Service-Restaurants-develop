import React from "react";

export interface KeyValueItemItemProps {
    name: string;
    value: string;
    showTopMargin?: boolean;
}

const KeyValueItem = ({ name, value, showTopMargin }: KeyValueItemItemProps): JSX.Element => {
    showTopMargin = showTopMargin ? showTopMargin : false;
    return (
        <div className={`flex ${showTopMargin ? "mt-4" : ""}`}>
            <span className="font-primary font-bold text-t-primary text-lg">{name}:</span>
            <span className="font-primary ml-1 text-t-primary text-lg">{value}</span>
        </div>
    );
};

export default KeyValueItem;
