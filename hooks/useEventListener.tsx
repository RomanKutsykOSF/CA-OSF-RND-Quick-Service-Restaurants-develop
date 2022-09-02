import { useRef, useEffect, RefObject } from "react";

function useEventListener<T extends HTMLElement = HTMLDivElement>(
    eventName: string,
    handler: (event: Event) => void,
    element: RefObject<T>
): void {
    const savedHandler = useRef<(event: Event) => void>();

    useEffect(() => {
        const targetElement: T = element?.current;
        if (!(targetElement && targetElement.addEventListener)) {
            return;
        }

        if (savedHandler.current !== handler) {
            savedHandler.current = handler;
        }

        const eventListener = (event: Event): void => {
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!savedHandler?.current) {
                savedHandler.current(event);
            }
        };

        targetElement.addEventListener(eventName, eventListener);

        return () => {
            targetElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element, handler]);
}

export default useEventListener;
