import React, { ReactNode } from "react";

interface SelectProps {
    id: string;
    formHooksRegister?: any;
    readOnly?: boolean;
    onChange?: React.FormEventHandler<HTMLInputElement>;
    label?: string;
    error?: string;
    children: ReactNode;
    className?: string;
}

const Select = ({
    label,
    id,
    readOnly,
    formHooksRegister,
    children,
    onChange,
    error,
    className,
}: SelectProps): JSX.Element => {
    return (
        <>
            <div className={`mt-6 ${className && className}`} onChange={onChange}>
                {label ? <label className={`font-primary font-medium text-sm text-t-primary `}>{label}</label> : ""}
                <select
                    className="appearance-none h-9 px-4 mt-1 font-primary p-0 text-sm text-t-secondary border border-br-readOnly rounded-lg w-full"
                    title={label}
                    readOnly={readOnly}
                    id={id}
                    {...formHooksRegister}
                >
                    {children}
                </select>
                {error ? <p className="error absolute leading-tight text-t-error -bottom-6">{error}</p> : ""}
            </div>
            <style jsx>{`
                select {
                    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDE0IDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMC4yOTI4OTMgMC4yOTI4OTNDMC42ODM0MTcgLTAuMDk3NjMxMSAxLjMxNjU4IC0wLjA5NzYzMTEgMS43MDcxMSAwLjI5Mjg5M0w3IDUuNTg1NzlMMTIuMjkyOSAwLjI5Mjg5M0MxMi42ODM0IC0wLjA5NzYzMTEgMTMuMzE2NiAtMC4wOTc2MzExIDEzLjcwNzEgMC4yOTI4OTNDMTQuMDk3NiAwLjY4MzQxNyAxNC4wOTc2IDEuMzE2NTggMTMuNzA3MSAxLjcwNzExTDcuNzA3MTEgNy43MDcxMUM3LjMxNjU4IDguMDk3NjMgNi42ODM0MiA4LjA5NzYzIDYuMjkyODkgNy43MDcxMUwwLjI5Mjg5MyAxLjcwNzExQy0wLjA5NzYzMTEgMS4zMTY1OCAtMC4wOTc2MzExIDAuNjgzNDE3IDAuMjkyODkzIDAuMjkyODkzWiIgZmlsbD0iIzI0MzAyNSIvPgo8L3N2Zz4=");
                    background-position: 98% center;
                    background-repeat: no-repeat;
                }

                select[readOnly] {
                    background-color: var(--bgr-faded);
                }
            `}</style>
        </>
    );
};

export default Select;
