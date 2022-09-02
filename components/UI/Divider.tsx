import React from "react";

interface DividerProps {
    theme?: "light" | "dark";
    className?: string;
}

const Divider = ({ theme, className }: DividerProps): JSX.Element => {
    const themeToUse = !theme ? "light" : theme;
    return <hr className={` ${themeToUse == "light" ? "bg-br-disabled" : "bg-br-faded"} border-0 h-px ${className}`} />;
};

export default Divider;
