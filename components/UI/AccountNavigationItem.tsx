import React from "react";
import Link from "next/link";

export interface AccountNavigationItemProps {
    title: string;
    link: string;
    isActive: boolean;
}

const AccountNavigationItem = ({ title, link, isActive }: AccountNavigationItemProps): JSX.Element => {
    return (
        <div className="mx-auto flex flex-col align-center w-64 mt-2">
            <Link href={link}>
                <button
                    className={`text-center py-2 px-5 rounded-3xl font-primary text-sm outline ${
                        isActive ? "lightGreen" : ""
                    }`}
                >
                    {title}
                </button>
            </Link>
            <style jsx>{`
                button {
                    transition: 250ms all;
                    font-weight: bold;
                }
                .outline {
                    color: var(--t-primary);
                    background: var(--bgr-primary);
                    border-color: var(--br-primary);
                }
                .lightGreen {
                    background: var(--bgr-tertiary-faded);
                }
            `}</style>
        </div>
    );
};

export default AccountNavigationItem;
