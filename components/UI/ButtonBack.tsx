import Link from "next/link";
import ConditionalWrapper from "components/Utils/ConditionalWrapper";

interface backButtonProps {
    path: string;
    text: string;
    className?: string;
    variant?: "primary" | "secondary";
}

const BackButton = ({ path, text, className, variant }: backButtonProps): JSX.Element => {
    return (
        <>
            <ConditionalWrapper condition={!!path} wrapper={(_children) => <Link href={path}>{_children}</Link>}>
                <button
                    className={`text-center py-2 px-5 rounded-3xl font-primary text-sm text-t-tertiary ${className} ${
                        !variant ? "primary" : "secondary"
                    }`}
                    type="button"
                >
                    {text}
                    <span className="icon-arrow-left float-left" />
                </button>
            </ConditionalWrapper>
            <style jsx>{`
                button {
                    transition: 250ms all;
                    font-weight: bold;
                    color: var(--t-tertiary);
                    border: 1px solid transparent;
                    padding: 1px 15px 3px;
                    border: 1px solid var(--br-secondary);
                    background-color: var(--bgr-primary);
                    color: var(--t-secondary);
                    font-family: var(--font-family-primary);
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 24px;
                }
                .secondary span {
                    color: var(--t-secondary-2);
                }
                .secondary {
                    border: none;
                    text-transform: uppercase;
                }
            `}</style>
        </>
    );
};

export default BackButton;
