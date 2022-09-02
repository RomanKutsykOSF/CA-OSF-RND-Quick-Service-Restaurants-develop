import { GlobalContext } from "context/global";
import React, { ReactNode, useContext } from "react";

interface CenterContentWrapperProps {
    className?: string;
    centeringDisabled?: boolean;
    maxWidth?: number;
    children: ReactNode;
    isMobileOnly?: boolean;
}

const CenterContentWrapper = ({
    className,
    children,
    centeringDisabled,
    maxWidth,
    isMobileOnly,
}: CenterContentWrapperProps): JSX.Element => {
    const mobileOnly = isMobileOnly ? isMobileOnly : false;
    const globalContext = useContext(GlobalContext);

    return (
        <div
            className={
                centeringDisabled
                    ? ``
                    : `centered-wrapper ${className ? className : ""} ${mobileOnly ? "mobile-only-centering" : ""}`
            }
        >
            {children}
            <style jsx>{`
                .centered-wrapper {
                    padding: 0 16px;
                    margin: 0 auto;
                    width: 100%;
                }

                @media only screen and (min-width: ${globalContext.viewports.large}px) {
                    .centered-wrapper {
                        margin: 0 auto;
                        padding: 0;
                        max-width: 960px;
                    }

                    .centered-wrapper.mobile-only-centering {
                        margin: 0;
                        padding: 0;
                        max-width: auto;
                    }
                }

                @media only screen and (min-width: ${globalContext.viewports.xlarge}px) {
                    .centered-wrapper {
                        padding: 0;
                        margin: 0 auto;
                        max-width: ${maxWidth ? maxWidth : "1138"}px;
                    }

                    .centered-wrapper.mobile-only-centering {
                        margin: 0;
                        padding: 0;
                        max-width: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default CenterContentWrapper;
