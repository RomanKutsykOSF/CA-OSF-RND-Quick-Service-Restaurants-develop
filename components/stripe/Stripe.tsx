import React, { useState, useEffect, useRef } from "react";
import DotsLoader from "components/UI/DotsLoader";

declare global {
    interface Window {
        Stripe: any;
    }
}

interface Colors {
    background: string;
    btnText: string;
    paymentMessageColor: string;
    loaderOverlay: string;
}

interface StripeAppearance {
    theme: string;
    labels?: string;
    variables?: {
        [key: string]: string;
    };
}

interface OSFStripeProps {
    stripePublicKey: string;
    appearance: StripeAppearance;
    colors: Colors;
    redirectRelativePath: string;
    graphqlBaseUrl: string;
    payButtonText: string;
    stripeLocale: string;
    unexpectedErrorText: string;
    siteId: string;
    orderNo: string;
}

const OSFStripe = ({
    appearance,
    colors,
    graphqlBaseUrl,
    payButtonText,
    redirectRelativePath,
    siteId,
    stripeLocale,
    stripePublicKey,
    unexpectedErrorText,
    orderNo,
}: OSFStripeProps): JSX.Element => {
    const stripeAreaRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [elements, setElements] = useState(null);
    const [stripeScriptLoaded, setStripeScriptLoaded] = useState<boolean>(false);
    const [stripeReference, setStripeReference] = useState(null);
    const defaultColours = {
        background: "rgb(84, 105, 212)",
        btnText: "#fff",
        paymentMessageColor: "#f00",
        loaderOverlay: "#fafafa",
    };

    const createPaymentIntent = async (stripe: any): Promise<void> => {
        setIsLoading(true);
        setStripeReference(stripe);
        const mutation = `
                mutation Mutation($orderNo: String!, $siteId: String!) {
                    stripeCreatePaymentIntent(orderNo: $orderNo, siteId: $siteId) {
                        clientSecret
                        status
                    }
                }
            `;

        const response = await fetch(graphqlBaseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                query: mutation,
                variables: {
                    siteId: siteId,
                    orderNo,
                },
            }),
        });

        const { data } = await response.json();

        const paymentIntentClientSecret = data?.stripeCreatePaymentIntent?.clientSecret;

        if (!paymentIntentClientSecret) {
            setMessage(unexpectedErrorText);
        }

        const stripeAppearance = appearance || {
            theme: "stripe",
        };

        const elements = await stripe.elements({
            appearance: stripeAppearance,
            clientSecret: paymentIntentClientSecret,
        });

        setElements(elements);

        const paymentElement = elements?.create("payment");

        setIsLoading(false);

        try {
            await paymentElement.mount(stripeAreaRef.current);
        } catch (error) {
            console.error(error);
        }
    };

    const submitPayment = async (orderNo: string): Promise<void> => {
        const stripeRedirectUrl = `${window.location.origin}/${redirectRelativePath}/${orderNo}`;

        const { error } = await stripeReference.confirmPayment({
            elements: elements,
            confirmParams: {
                return_url: stripeRedirectUrl,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage(unexpectedErrorText);
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        const script = attachStripeLib();

        if (window.Stripe) {
            setStripeScriptLoaded(true);
        }

        script.addEventListener("load", function () {
            setStripeScriptLoaded(true);
        });

        if (stripeScriptLoaded) {
            const stripeReference = window.Stripe(stripePublicKey, {
                locale: stripeLocale,
            });

            createPaymentIntent(stripeReference);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stripeLocale, stripePublicKey, stripeScriptLoaded]);

    const attachStripeLib = (): HTMLScriptElement => {
        const scriptUrl = "https://js.stripe.com/v3/";
        const scripts = document.getElementsByTagName("script");

        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src.indexOf(scriptUrl) === 0) {
                return scripts[i];
            }
        }

        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.type = "text/javascript";
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);

        return script;
    };

    // Show a spinner on payment submission
    const defaultStyleString = `--background: ${defaultColours?.background};--btn-text: ${defaultColours.btnText};--payment-message-color: ${defaultColours.paymentMessageColor};--loader-overlay: ${defaultColours.loaderOverlay};`;
    const configuredStyleString = `--background: ${colors?.background || defaultColours?.background};--btn-text: ${
        colors?.btnText || defaultColours?.btnText
    };--payment-message-color: ${
        colors?.paymentMessageColor || defaultColours?.paymentMessageColor
    };--loader-overlay: ${colors?.loaderOverlay || defaultColours?.loaderOverlay};`;

    return (
        <>
            <style>{`.osf-stripe-root {${defaultStyleString}}`}</style>
            <style>{`.osf-stripe-root {${configuredStyleString}}`}</style>

            <section className="osf-stripe-root">
                <section className="osf-stripe">
                    {stripeScriptLoaded && !isLoading ? (
                        <div className="stripe-elements-wrapper">
                            <div className="stripe-element-wrapper" ref={stripeAreaRef}></div>
                        </div>
                    ) : (
                        <div className="flex justify-center loader items-center">
                            <DotsLoader variant="dark" />
                        </div>
                    )}

                    <button
                        disabled={isSubmitting || !stripeScriptLoaded || isLoading}
                        id="submit"
                        onClick={() => {
                            submitPayment(orderNo);
                            setIsSubmitting(true);
                        }}
                    >
                        <div className="spinner hidden" id="spinner"></div>
                        {isSubmitting ? (
                            <div className="spinner" id="spinner"></div>
                        ) : (
                            <span id="button-text">{payButtonText}</span>
                        )}
                    </button>
                    {message && <div id="payment-message">{message}</div>}
                </section>
            </section>

            <style jsx>{`
                .osf-stripe-root {
                    width: 100%;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 16px;
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    width: 100%;
                }

                .osf-stripe {
                    width: 100%;
                    align-self: center;
                    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1), 0px 2px 5px 0px rgba(50, 50, 93, 0.1),
                        0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
                    border-radius: 7px;
                    padding: 40px;
                }

                @media screen and (min-width: 1024px) {
                    .osf-stripe {
                        min-width: 500px;
                    }
                }

                #payment-message {
                    color: var(--payment-message-color);
                    font-size: 16px;
                    line-height: 20px;
                    padding-top: 12px;
                    text-align: center;
                }

                /* Buttons and links */
                button {
                    margin-top: 20px;
                    background: var(--background);
                    font-family: Arial, sans-serif;
                    color: var(--btn-text);
                    border-radius: 4px;
                    border: 0;
                    padding: 12px 16px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: block;
                    transition: all 0.2s ease;
                    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
                    width: 100%;
                }

                button:hover {
                    filter: contrast(115%);
                }
                button:disabled {
                    opacity: 0.5;
                    cursor: default;
                }

                /* spinner/processing state, errors */
                .spinner,
                .spinner:before,
                .spinner:after {
                    border-radius: 50%;
                }
                .spinner {
                    color: var(--btn-text);
                    font-size: 22px;
                    text-indent: -99999px;
                    margin: 0px auto;
                    position: relative;
                    width: 20px;
                    height: 20px;
                    box-shadow: inset 0 0 0 2px;
                    -webkit-transform: translateZ(0);
                    -ms-transform: translateZ(0);
                    transform: translateZ(0);
                }
                .spinner:before,
                .spinner:after {
                    position: absolute;
                    content: "";
                }
                .spinner:before {
                    width: 10.4px;
                    height: 20.4px;
                    background: var(--background);
                    border-radius: 20.4px 0 0 20.4px;
                    top: -0.2px;
                    left: -0.2px;
                    -webkit-transform-origin: 10.4px 10.2px;
                    transform-origin: 10.4px 10.2px;
                    -webkit-animation: loading 2s infinite ease 1.5s;
                    animation: loading 2s infinite ease 1.5s;
                }
                .spinner:after {
                    width: 10.4px;
                    height: 10.2px;
                    background: var(--background);
                    border-radius: 0 10.2px 10.2px 0;
                    top: -0.1px;
                    left: 10.2px;
                    -webkit-transform-origin: 0px 10.2px;
                    transform-origin: 0px 10.2px;
                    -webkit-animation: loading 2s infinite ease;
                    animation: loading 2s infinite ease;
                }

                @-webkit-keyframes loading {
                    0% {
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }
                @keyframes loading {
                    0% {
                        -webkit-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }

                .stripe-elements-wrapper {
                    min-height: 160px;
                    position: relative;
                }

                .loader {
                    min-height: 160px;
                }
            `}</style>
        </>
    );
};

export default OSFStripe;
