import React, { Fragment } from "react";
import Button from "components/UI/Button";
import { Dialog, Transition } from "@headlessui/react";

export interface PopupProps {
    title: string;
    text: string | JSX.Element;
    yesText: string;
    noText?: string;
    actionFunction: (params?) => void;
    isPopupVisible: boolean;
    onClose?: () => void;
    forceUserAction?: boolean;
    isLoading?: boolean;
    actionBtnDisabled?: boolean;
}

const Modal = ({
    title,
    text,
    yesText,
    noText,
    actionFunction,
    isPopupVisible,
    onClose,
    isLoading = false,
    forceUserAction = false,
    actionBtnDisabled = false,
}: PopupProps): JSX.Element => {
    return (
        <Transition appear show={isPopupVisible} as={Fragment}>
            <Dialog
                as="div"
                static
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={() => {
                    !forceUserAction && onClose();
                }}
            >
                <div className="min-h-screen flex justify-center items-center">
                    <Dialog.Overlay className="fixed inset-0 bg-bgr-secondary opacity-70" />

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block max-w-lg w-full p-6 my-8 overflow-hidden text-left transition-all transform shadow-xl rounded-2xl bg-bgr-primary">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-t-primary">
                                {title}
                            </Dialog.Title>
                            <div className="mt-2">
                                {typeof text === "string" ? <p className="text-sm text-t-secondary">{text}</p> : text}
                            </div>

                            <div className="mt-4">
                                <Button
                                    isLoading={isLoading}
                                    disabled={isLoading || actionBtnDisabled}
                                    variant="primary"
                                    onClick={actionFunction}
                                >
                                    {yesText}
                                </Button>
                                {noText ? (
                                    <span>
                                        <Button
                                            disabled={isLoading}
                                            variant="outline-custom"
                                            className=" ml-2 "
                                            onClick={onClose}
                                        >
                                            {noText}
                                        </Button>
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
