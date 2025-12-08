import React, { useState, useEffect } from "react";
import "./Loading.css";

export default function Loading({ onFinish }) {
    const [lettersVisible, setLettersVisible] = useState(0);
    const [exit, setExit] = useState(false);

    const text = "hello!";

    useEffect(() => {
        const interval = setInterval(() => {
            setLettersVisible((prev) => {
                if (prev < text.length) {
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    // trigger exit after a short delay
                    setTimeout(() => setExit(true), 500);
                    // Call onFinish after exit animation completes to ensure loading screen is gone
                    setTimeout(() => onFinish(), 1800);
                    return prev;
                }
            });
        }, 200);

        return () => clearInterval(interval);
    }, [text.length, onFinish]);

    return (
        <div className={`loading-screen ${exit ? "exit" : ""}`}>
            <div className="loading-hello-container">
                <h1 className="loading-hello">{text.slice(0, lettersVisible)}</h1>
            </div>
        </div>
    );
}