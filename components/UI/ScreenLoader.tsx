import FocusTrap from "focus-trap-react";

const ScreenLoader = (): JSX.Element => {
    return (
        <>
            <FocusTrap active={true}>
                <div>
                    <button className="absolute opacity-0" title="preloader" />

                    <div className="app-screen-block fixed flex items-center justify-center left-0 top-0 w-full h-full bg-bgr-secondary opacity-80">
                        <div className="loader" />
                    </div>
                </div>
            </FocusTrap>
            <style jsx>{`
                .app-screen-block {
                    position: fixed;
                    left: 0;
                    top: 0;
                    z-index: 1000000;
                }

                .loader {
                    color: var(--bgr-primary);
                    font-size: 20px;
                    margin: 100px auto;
                    width: 1em;
                    height: 1em;
                    border-radius: 50%;
                    position: relative;
                    text-indent: -9999em;
                    animation: load4 1.3s infinite linear;
                    transform: translateZ(0);
                }

                @-webkit-keyframes load4 {
                    0%,
                    100% {
                        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
                    }
                    12.5% {
                        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
                    }
                    25% {
                        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em,
                            -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
                    }
                    37.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
                            -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    50% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
                            -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    62.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
                            -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
                    }
                    75% {
                        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
                    }
                    87.5% {
                        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
                    }
                }

                @keyframes load4 {
                    0%,
                    100% {
                        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
                    }
                    12.5% {
                        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
                    }
                    25% {
                        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em,
                            -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
                    }
                    37.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
                            -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    50% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
                            -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    62.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
                            -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
                    }
                    75% {
                        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
                    }
                    87.5% {
                        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
                            -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
                    }
                }
            `}</style>
        </>
    );
};

export default ScreenLoader;
