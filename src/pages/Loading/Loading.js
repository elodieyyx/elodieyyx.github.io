import React, { useEffect, useMemo, useState } from "react";

export default function Loading({ onFinish }) {
    const receiptLines = useMemo(() => [
        { label: "order", value: "#2026" },
        { label: "item", value: "portfolio menu" },
        { label: "prep", value: "plating projects" },
        { label: "drink", value: "pouring matcha" },
        { label: "status", value: "ready to serve" },
    ], []);

    const [activeLine, setActiveLine] = useState(-1);
    const [typedCount, setTypedCount] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [exit, setExit] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const timers = [];
        const TYPE_SPEED = 82;
        const LINE_PAUSE = 420;

        const schedule = (fn, delay) => {
            const timer = setTimeout(() => {
                if (!cancelled) fn();
            }, delay);
            timers.push(timer);
        };

        const typeLine = (lineIndex, charIndex = 0) => {
            if (lineIndex >= receiptLines.length) {
                setIsComplete(true);
                schedule(() => setExit(true), 980);
                schedule(onFinish, 1900);
                return;
            }

            setActiveLine(lineIndex);
            setTypedCount(charIndex);

            if (charIndex < receiptLines[lineIndex].value.length) {
                schedule(() => typeLine(lineIndex, charIndex + 1), TYPE_SPEED);
                return;
            }

            schedule(() => typeLine(lineIndex + 1, 0), LINE_PAUSE);
        };

        schedule(() => typeLine(0, 0), 620);

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
        };
    }, [onFinish, receiptLines]);

    const visibleLines = activeLine < 0
        ? []
        : receiptLines.slice(0, Math.min(activeLine + 1, receiptLines.length));

    return (
        <div className={`loading-screen ${exit ? "exit" : ""}`}>
            <div className="receiptPrinter" aria-label="Loading portfolio">
                <div className="receiptSlot" aria-hidden="true" />
                <div className="receiptPaper">
                    <div className="receiptHeader">
                        <span className="receiptKicker">Elodie's Brunch Bar</span>
                        <strong>Today's Menu</strong>
                    </div>

                    <div className="receiptRule" />

                    <div className="receiptLines">
                        {visibleLines.map((line, index) => (
                            <div
                                className={`receiptLine${index === activeLine && !isComplete ? " isTyping" : ""}`}
                                key={line.label}
                            >
                                <span>{line.label}</span>
                                <span>{index === activeLine ? line.value.slice(0, typedCount) : line.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className={`receiptStamp${isComplete ? " isVisible" : ""}`}>
                        served
                    </div>
                </div>
            </div>
        </div>
    );
}
