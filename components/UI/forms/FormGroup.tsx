import React, { ReactNode } from "react";

interface FormGroupProps {
    columns?: "one" | "two" | "full-width";
    children: ReactNode;
    tabletViewport: number;
}

const FormGroup = ({ columns, children, tabletViewport }: FormGroupProps): JSX.Element => {
    const howMuchColumns = columns || "full-width";
    return (
        <>
            <fieldset className={`${howMuchColumns}-col`}>{children}</fieldset>
            <style jsx>{`
                fieldset {
                    display: grid;
                    grid-template-columns: auto;
                }

                @media only screen and (min-width: ${tabletViewport}px) {
                    fieldset {
                        column-gap: 30px;
                    }

                    fieldset.one-col {
                        grid-template-columns: calc(50% - 15px);
                    }

                    fieldset.two-col {
                        grid-template-columns: calc(50% - 15px) calc(50% - 15px);
                    }

                    fieldset.full-width-col {
                        grid-template-columns: auto;
                    }
                }
            `}</style>
        </>
    );
};

export default FormGroup;
