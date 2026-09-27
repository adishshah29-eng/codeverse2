import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSharedTypewriterAudio } from "./useSharedTypewriterAudio";

/**
 * Hook to handle scroll-triggered, word-by-word typewriter reveal with Web Audio sync.
 *
 * @param {Object} options
 * @param {string[]} options.lines Array of string lines for the narrative block
 * @param {number} [options.wordDelay=150] Delay between words (ms)
 * @param {number} [options.linePause=500] Delay between lines (ms)
 * @param {number} [options.threshold=0.35] Visibility threshold (~30-40%)
 * @param {string} [options.triggerId] Optional DOM id of scroll track sentinel to observe
 * @param {boolean} [options.isActive] Optional manual activation override
 * @param {Function} [options.onComplete] Callback when all lines finish revealing
 */
export function useScrollTypewriter({
  lines: rawLines = [],
  wordDelay = 150,
  linePause = 500,
  threshold = 0.35,
  triggerId,
  isActive: manualIsActive,
  onComplete,
} = {}) {
  const { playWordClack } = useSharedTypewriterAudio();

  const linesKey = Array.isArray(rawLines) ? rawLines.join("|||") : String(rawLines ?? "");
  const lines = useMemo(() => {
    if (Array.isArray(rawLines)) return rawLines;
    if (typeof rawLines === "string") return [rawLines];
    return [];
  }, [linesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-split lines into word arrays
  const lineWords = useMemo(() => {
    return lines.map((line) => (line ? line.trim().split(/\s+/) : []));
  }, [lines]);

  const targetRef = useRef(null);
  const timerRef = useRef(null);
  const hasTriggeredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Revealed word counts per line
  const [revealedWordCounts, setRevealedWordCounts] = useState(() => {
    if (reducedMotion) {
      return lineWords.map((words) => words.length);
    }
    return lines.map(() => 0);
  });

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(() => reducedMotion);
  const [hasStarted, setHasStarted] = useState(() => reducedMotion);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Word-by-word reveal sequence
  const startWordSequence = useCallback(() => {
    if (hasTriggeredRef.current && isComplete) return;
    clearTimer();

    // If reduced motion is requested, show full text immediately without sound
    if (reducedMotion) {
      setRevealedWordCounts(lineWords.map((words) => words.length));
      setIsComplete(true);
      setIsTyping(false);
      setHasStarted(true);
      onCompleteRef.current?.();
      return;
    }

    if (lines.length === 0) {
      setIsComplete(true);
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    setRevealedWordCounts(lines.map(() => 0));
    setCurrentLineIndex(0);
    setIsTyping(true);
    setIsComplete(false);
    setHasStarted(true);

    let activeLine = 0;
    let activeWordIndex = 0;

    const revealNextWord = () => {
      if (activeLine >= lines.length) {
        setIsTyping(false);
        setIsComplete(true);
        onCompleteRef.current?.();
        return;
      }

      const totalWords = lineWords[activeLine]?.length || 0;

      if (activeWordIndex < totalWords) {
        activeWordIndex++;
        const currentCount = activeWordIndex;
        const lineIdx = activeLine;

        setRevealedWordCounts((prev) => {
          const next = [...prev];
          next[lineIdx] = currentCount;
          return next;
        });

        // Play synchronized typewriter clack per word reveal
        playWordClack();

        // Jitter: 120ms - 180ms range for human cadence (±20ms)
        const jitter = (Math.random() * 40 - 20);
        const delay = Math.max(90, wordDelay + jitter);

        timerRef.current = setTimeout(revealNextWord, delay);
      } else {
        // Line finished, move to next line if available
        activeLine++;
        activeWordIndex = 0;

        if (activeLine < lines.length) {
          setCurrentLineIndex(activeLine);
          // Inter-line pause (~500ms)
          timerRef.current = setTimeout(revealNextWord, linePause);
        } else {
          // Entire block completed
          setIsTyping(false);
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      }
    };

    // First word starts after a tiny initial tick
    timerRef.current = setTimeout(revealNextWord, 60);
  }, [lines, lineWords, wordDelay, linePause, reducedMotion, isComplete, playWordClack, clearTimer]);

  // Synchronize state if user toggles reduced motion preference
  useEffect(() => {
    if (reducedMotion) {
      setRevealedWordCounts(lineWords.map((words) => words.length));
      setIsComplete(true);
      setIsTyping(false);
      setHasStarted(true);
    }
  }, [reducedMotion, lineWords]);

  // Scroll triggering via IntersectionObserver
  useEffect(() => {
    if (reducedMotion) return;

    // Manual override if provided
    if (manualIsActive !== undefined) {
      if (manualIsActive && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        startWordSequence();
      }
      return;
    }

    if (hasTriggeredRef.current) return;

    let cleanupScrollListener = null;

    // Observe specific trigger element or the component itself
    const observedElement = triggerId
      ? document.getElementById(triggerId)
      : targetRef.current;

    if (!observedElement || typeof IntersectionObserver === "undefined") {
      if (targetRef.current) {
        hasTriggeredRef.current = true;
        startWordSequence();
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger when ~30-40% visible, fires once
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            // Guard: ensure text doesn't type on page load before user scrolls
            if (typeof window !== "undefined" && window.scrollY < 20 && entry.boundingClientRect.top < window.innerHeight * 0.5) {
              const handleFirstScroll = () => {
                if (!hasTriggeredRef.current && window.scrollY >= 20) {
                  hasTriggeredRef.current = true;
                  startWordSequence();
                  observer.disconnect();
                  window.removeEventListener("scroll", handleFirstScroll);
                }
              };
              cleanupScrollListener = () => window.removeEventListener("scroll", handleFirstScroll);
              window.addEventListener("scroll", handleFirstScroll, { passive: true });
              return;
            }

            if (!hasTriggeredRef.current) {
              hasTriggeredRef.current = true;
              startWordSequence();
              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: [0, threshold],
      }
    );

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
      if (cleanupScrollListener) cleanupScrollListener();
      clearTimer();
    };
  }, [manualIsActive, triggerId, threshold, reducedMotion, lineWords, startWordSequence, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    targetRef,
    lineWords,
    revealedWordCounts,
    currentLineIndex,
    isTyping,
    isComplete,
    hasStarted,
    reducedMotion,
  };
}

export default useScrollTypewriter;
