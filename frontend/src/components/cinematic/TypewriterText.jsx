import React, { useState, useEffect, useRef } from "react";

export function TypewriterText({
  text,
  isActive = false,
  startDelay = 0,
  speed = 32,
  onComplete,
  className = "",
  cursorClassName = "",
  showCursor = true,
  reducedMotion = false,
}) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      if (isActive) {
        setDisplayedLength(text.length);
        setIsComplete(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
      return;
    }

    if (!isActive) {
      // Do not reset if it was already partially or fully typed unless never active
      return;
    }

    if (startedRef.current && isComplete) {
      return;
    }

    startedRef.current = true;

    const startTimeout = setTimeout(() => {
      const typeNextChar = () => {
        setDisplayedLength((prev) => {
          if (prev >= text.length) {
            setIsComplete(true);
            if (onCompleteRef.current) onCompleteRef.current();
            return text.length;
          }

          const next = prev + 1;
          if (next >= text.length) {
            setIsComplete(true);
            if (onCompleteRef.current) onCompleteRef.current();
            return text.length;
          }

          // Natural human cadence
          const char = text[prev];
          let delay = speed;
          if (char === "." || char === "…" || char === "?" || char === "!") {
            delay = speed * 3.8;
          } else if (char === "," || char === ";") {
            delay = speed * 2.2;
          } else {
            delay = speed + (Math.random() * 12 - 6);
          }

          timerRef.current = setTimeout(typeNextChar, delay);
          return next;
        });
      };

      timerRef.current = setTimeout(typeNextChar, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, text, speed, startDelay, reducedMotion, isComplete]);

  const displayedText = text.slice(0, displayedLength);

  return (
    <span className={`inline-block font-sans tracking-wide leading-relaxed ${className}`}>
      <span>{displayedText}</span>
      {showCursor && isActive && !isComplete && (
        <span
          className={`inline-block w-[2px] h-[1.1em] ml-1 bg-red-600/90 align-middle animate-pulse ${cursorClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export default TypewriterText;
