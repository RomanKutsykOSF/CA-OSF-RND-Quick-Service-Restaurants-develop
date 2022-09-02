import { Transition } from "@headlessui/react";
import { GlobalContext } from "context/global";
import { useContext } from "react";

export interface NotificationProps {
    type: "info" | "error" | "success";
    message: string;
    isVisible?: boolean;
    autoClose: boolean;
    onClose?: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps): JSX.Element => {
    const { activeNotification } = useContext(GlobalContext);

    return (
        <Transition
            show={activeNotification.isVisible}
            enter="transition-transform duration-300 ease-in-out transform"
            enterFrom="translate-x-64"
            enterTo="translate-x-0"
            leave="transition-transform duration-300 ease-in-out transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-64"
        >
            <div
                className={`border-l-4 shadow-lg ${
                    type === "error"
                        ? "text-t-error bg-bgr-error"
                        : type === "success"
                        ? "text-t-secondary bg-bgr-tertiary-faded border-bgr-tertiary"
                        : ""
                }`}
            >
                <div className={`flex items-center justify-center p-4`} role="alert">
                    <p className={"lg:text-sm font-primary text-xs mr-4"}>{message}</p>
                    <span
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && onClose()}
                        onClick={onClose}
                        role="button"
                        className="icon-cross top-0 bottom-0 right-0 text-lg"
                    />
                </div>
            </div>
        </Transition>
    );
};

export default Notification;
