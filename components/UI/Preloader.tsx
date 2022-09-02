import React from "react";

const Preloader = (): JSX.Element => {
    return (
        <>
            <div className="app-line-preloader relative">
                <div className="app-line-preloader__body" />
            </div>

            <style jsx>{`
                .app-line-preloader {
                    z-index: 1000000;
                }

                .app-line-preloader .app-line-preloader__body {
                    animation: lineloading 4s infinite;
                    animation-timing-function: cubic-bezier(0.28, 0.84, 0.42, 1);
                    height: 5px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    background-color: var(--bgr-tertiary);
                }

                @keyframes lineloading {
                    0% {
                        width: 0;
                    }
                    25% {
                        width: 25%;
                    }
                    50% {
                        width: 50%;
                    }
                    75% {
                        width: 65%;
                    }
                    85% {
                        width: 70%;
                    }
                    100% {
                        width: 100%;
                    }
                }
            `}</style>
        </>
    );
};

export default Preloader;
