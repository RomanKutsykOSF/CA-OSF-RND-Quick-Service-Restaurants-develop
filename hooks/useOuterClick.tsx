import { useRef, useEffect } from "react";

type Callback = (e: Event) => void;

export default function useOuterClick(callback: Callback): any {
    const callbackRef = useRef<Callback>(null); // initialize mutable callback ref
    const innerRef = useRef(null); // returned to client, who sets the "border" element

    // update callback on each render, so second useEffect has most recent callback
    useEffect(() => {
        callbackRef.current = callback;
    });
    useEffect(() => {
        function handleClick(e): void {
            const { current: currentInner } = innerRef;
            const { current: currentCallback } = callbackRef;
            if (currentInner && currentCallback && !currentInner.contains(e.target)) {
                currentCallback(e);
            }
        }

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []); // no dependencies -> stable click listener

    return innerRef; // convenience for client (doesn't need to init ref himself)
}
