import { createElement, ReactNode } from "react";

export interface TitleProps {
    type: "h1" | "h2" | "h3";
    alignment?: "center" | "left";
    children?: ReactNode;
    className?: string;
}

const Title = ({ type, children, alignment, className }: TitleProps): JSX.Element => {
    alignment = alignment ? alignment : "center";

    const defaultClassNamesDict = {
        h1: `${alignment === "center" && "text-center"} text-xl lg:text-2xl font-bold lg:whitespace-nowrap`,
        h2: `${alignment === "center" && "text-center"} text-lg lg:text-xl font-bold lg:whitespace-nowrap`,
        h3: `${alignment === "center" && "text-center"} text-lg lg:text-lg font-bold lg:whitespace-nowrap`,
    };

    const classes = [defaultClassNamesDict[type], className].join(" ");

    return createElement(type, { className: classes }, children);
};

export default Title;
