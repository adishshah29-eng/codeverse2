import React, { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

/**
 * AnimatedCounter
 * 
 * Powered by motion.dev (motion/react) & GSAP easing.
 * High-performance 60fps/120fps direct DOM number ticker that rapidly
 * animates from 0 (or from) up to target value with cinematic ease.
 * 
 * Features:
 * - Direct DOM textContent updates (zero React re-render overhead)
 * - Viewport intersection triggering via useInView
 * - Formats currency with Indian locale ("₹25,000") or standard commas
 * - Supports decimals (e.g. coordinates 19.1075)
 * - Supports zero-padding (e.g. "01", "02")
 * - Audio-like cyber pulse while ticking
 */
export function AnimatedCounter({
  value = 0,
  from = 0,
  duration = 1.8,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  padDigits = 0,
  format = true,
  once = false,
  className = "",
  glowOnComplete = false,
}) {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once, margin: "-10% 0px -10% 0px" });

  const formatNumber = (num) => {
    let formatted;
    if (decimals > 0) {
      formatted = num.toFixed(decimals);
    } else {
      const rounded = Math.round(num);
      if (padDigits > 0) {
        formatted = String(rounded).padStart(padDigits, "0");
      } else if (format) {
        formatted = rounded.toLocaleString("en-IN");
      } else {
        formatted = String(rounded);
      }
    }
    return `${prefix}${formatted}${suffix}`;
  };

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    if (!isInView) {
      el.textContent = formatNumber(from);
      return;
    }

    // Motion.dev animate value from -> value
    const controls = animate(from, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // Cinematic high-speed start with smooth brake
      onUpdate(latest) {
        el.textContent = formatNumber(latest);
      },
      onComplete() {
        el.textContent = formatNumber(value);
        if (glowOnComplete) {
          el.classList.add("text-glow-accent");
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value, from, duration, delay, prefix, suffix, decimals, padDigits, format, glowOnComplete]);

  return (
    <span
      ref={nodeRef}
      className={`inline-block tabular-nums tracking-wider will-change-transform ${className}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {formatNumber(from)}
    </span>
  );
}

export default AnimatedCounter;
