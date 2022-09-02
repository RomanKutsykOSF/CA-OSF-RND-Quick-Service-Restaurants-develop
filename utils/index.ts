import logoutFetcher, { logoutMutation } from "bdConnector/account/logout";
import { FetcherResponse } from "bdConnector/types";
import { NotificationProps } from "components/UI/Notification";
import { GlobalUserData } from "interfaces/globalContext";
import { Dispatch } from "react";
import { KeyedMutator } from "swr";

export async function handleLogout(
    setScreenBlockLoader: React.Dispatch<React.SetStateAction<boolean>>,
    swrGetUserDataMutate: KeyedMutator<FetcherResponse<GlobalUserData>>,
    showNotification: Dispatch<React.SetStateAction<NotificationProps>>,
    internalServerError: string
): Promise<void> {
    setScreenBlockLoader(true);

    const { data, errorCode } = await logoutFetcher(logoutMutation);

    if (errorCode) {
        setScreenBlockLoader(false);

        showNotification({
            type: "error",
            autoClose: true,
            message: internalServerError,
        });
        return;
    }

    await swrGetUserDataMutate({ data }, false);
    setScreenBlockLoader(false);
}

export function debounce<Params extends any[]>(
    func: (...args: Params) => any,
    timeout: number
): (...args: Params) => void {
    let timer: NodeJS.Timeout;
    return (...args: Params) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

export function throttle(callback: () => any, limit: number): () => void {
    let waiting = false;
    return function () {
        if (!waiting) {
            // eslint-disable-next-line prefer-rest-params
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(function () {
                waiting = false;
            }, limit);
        }
    };
}

export function validatePhone(phone: string, invalidPhoneText: string): boolean | string {
    const phoneRegex = /^\+?[0-9-]+$/;

    if (phoneRegex.test(phone)) {
        return true;
    } else {
        return invalidPhoneText;
    }
}

export function validateEmail(email: string, invalidEmailText: string): boolean | string {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (emailRegex.test(email)) {
        return true;
    } else {
        return invalidEmailText;
    }
}

export function validatePostalCode(value: string, invalidCodeText: string): boolean | string {
    return (value.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/) && true) || invalidCodeText;
}
