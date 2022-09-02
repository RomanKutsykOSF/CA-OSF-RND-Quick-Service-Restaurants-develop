import React, { ReactNode, useState, useEffect, useRef } from "react";
import Button from "components/UI/Button";

export interface VerticalCollapseProps {
    children: ReactNode;
    minHeight?: string;
    buttonTextCollapsed: string;
    buttonTextExpanded: string;
    visible: boolean;
}

const VerticalCollapse = ({
    children,
    minHeight,
    buttonTextCollapsed,
    buttonTextExpanded,
    visible,
}: VerticalCollapseProps): JSX.Element => {
    const [isExpanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const toggleExpanded = (): void => {
        setExpanded(!isExpanded);
    };
    const classList = ["vertical-collapse"];
    if (isExpanded) {
        classList.push("vertical-collapse--expanded");
    }

    if (!visible) {
        classList.push("hidden");
    }

    useEffect(() => {
        if (!visible) {
            setExpanded(false);
        }
    }, [visible]);

    return (
        <div className={classList.join(" ")}>
            <div ref={contentRef} className="relative vertical-collapse__content">
                {children}
            </div>
            <Button
                type="button"
                variant="text-link-underline"
                onClick={toggleExpanded}
                customTextColorClass="text-t-secondary-2"
            >
                {isExpanded ? buttonTextExpanded : buttonTextCollapsed}
            </Button>

            <style jsx>{`
                .vertical-collapse__content {
                    height: ${isExpanded ? contentRef.current.scrollHeight + "px" : minHeight};
                    overflow: hidden;
                    transition: height 250ms;
                    padding-bottom: 15px;
                }

                .vertical-collapse__content::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    height: 50px;
                    background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
                    pointer-events: none;
                    transition: 250ms;
                    transition-delay: 250ms;
                }

                .vertical-collapse--expanded .vertical-collapse__content::after {
                    background: transparent;
                }
            `}</style>
        </div>
    );
};

export default VerticalCollapse;
