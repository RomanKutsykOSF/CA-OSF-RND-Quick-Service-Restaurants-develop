import React from "react";

export interface SizeTileProps {
    id: string;
    isActive: boolean;
    title: string;
    subTitle: string;
    price: string | null;
}

const SizeTile = ({ id, isActive, title, subTitle, price }: SizeTileProps): JSX.Element => {
    return (
        <button
            disabled={price === null}
            id={id}
            className={`flex rounded-lg w-full items-center px-3 py-2 size-tile ${isActive && "size-tile--active"}`}
            onClick={() => {
                window.location.href = `/product/${id}`;
            }}
        >
            <span className="flex justify-center items-center rounded-full border border-br-secondary w-5 h-5">
                <div className={`rounded-full bg-bgr-tertiary w-3 h-3 ${isActive ? "visible" : "hidden"}`}></div>
            </span>
            <span className="flex flex-col ml-3">
                <span className="font-bold text-sm">{title}</span>
                <span className="text-sm">{subTitle}</span>
            </span>
            {price ? (
                <span className="self-start ml-auto">{price}</span>
            ) : (
                <span className="self-start text-xs ml-auto text-t-error">{`Unavailable`}</span>
            )}
            <style jsx>{`
                .size-tile {
                    border: 1px solid var(--br-secondary);
                    border-left: 8px solid var(--bgr-tertiary-faded);
                }

                .size-tile--active {
                    border-left-color: var(--br-primary);
                }
            `}</style>
        </button>
    );
};

export default SizeTile;
