import { KeyboardEventHandler, MouseEventHandler, ReactNode } from "react";

interface SlideDrawerProps {
    show: boolean;
    children: ReactNode;
    onClick: MouseEventHandler<any>;
    onKeyDown: KeyboardEventHandler<any>;
}

const SlideDrawer = ({ children, show, onClick, onKeyDown }: SlideDrawerProps): JSX.Element => {
    return (
        <>
            <div
                className={`z-50 text-t-tertiary h-full lg:hidden bg-bgr-primary fixed top-0 left-0 w-full slide-drawer${
                    show ? " open" : ""
                }`}
            >
                <i
                    tabIndex={0}
                    role="button"
                    onKeyDown={onKeyDown}
                    onClick={onClick}
                    className="icon-cross text-t-primary text-xl cursor-pointer"
                ></i>
                {children}
            </div>

            <style jsx>{`
                .slide-drawer {
                    width: 85%;
                    padding: 15px;
                    z-index: 101;
                    box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
                    transform: translateX(-101%);
                    transition: transform 0.2s ease-out;
                    overflow-y: scroll;
                }

                .slide-drawer .slide-drawer {
                    width: 100%;
                    overflow: auto;
                }

                .slide-drawer.open {
                    transform: translateX(0);
                }

                i:before {
                    margin: 0;
                }
            `}</style>
        </>
    );
};

export default SlideDrawer;
