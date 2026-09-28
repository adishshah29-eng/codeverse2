import React from "react";
import { useReducedMotion } from "motion/react";
import { useScrambleText } from "./useScrambleText";

/**
 * DecryptText Component
 * Renders answer text resolving from left-to-right with vault cipher glyphs,
 * frontier laser cursor block, and security status badge.
 */
export function DecryptText({
  text = "",
  active = false,
  duration = 900,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();
  const { chars, isScrambling, isDecrypted } = useScrambleText(
    text,
    active,
    { duration }
  );

  if (shouldReduceMotion) {
    return (
      <div className={`faq-decrypt-container ${className}`}>
        <div className="faq-decrypt-badge mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#E50914] uppercase select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
          <span>DECRYPTED.</span>
        </div>
        <p className="font-sans text-sm sm:text-base text-[#A3A3A3] font-light leading-relaxed">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className={`faq-decrypt-container ${className}`}>
      {/* Security Status Badge: ENCRYPTED... -> DECRYPTED. */}
      <div className="faq-decrypt-badge mb-2.5 flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-[#E50914] uppercase select-none">
        <span
          className={`w-1.5 h-1.5 rounded-full bg-[#E50914] ${
            isScrambling ? "animate-ping" : "shadow-[0_0_6px_#E50914]"
          }`}
        />
        <span
          className={`transition-all duration-300 font-semibold ${
            isDecrypted
              ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              : "text-[#E50914]"
          }`}
        >
          {isScrambling ? "ENCRYPTING..." : "DECRYPTED."}
        </span>
      </div>

      {/* Decrypting Text Body */}
      <p className="faq-decrypt-body font-mono sm:font-sans text-sm sm:text-base font-light leading-relaxed tracking-wide select-text">
        {chars.map((item, idx) => {
          if (item.isSpace) {
            return <span key={idx}> </span>;
          }

          if (item.isLocked) {
            return (
              <span
                key={idx}
                className="text-[#F5F2ED] transition-colors duration-150"
              >
                {item.char}
              </span>
            );
          }

          if (item.isFrontier) {
            return (
              <span key={idx} className="relative inline-block text-[#E50914] font-mono font-bold">
                {item.char}
                {isScrambling && (
                  <span
                    className="faq-frontier-cursor ml-0.5 inline-block w-1.5 h-[1.1em] bg-[#E50914] align-middle shadow-[0_0_8px_#E50914]"
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          }

          // Unresolved cipher characters ahead of the frontier
          return (
            <span
              key={idx}
              className="text-[#E50914]/40 font-mono text-[0.95em] select-none [text-shadow:0_0_6px_rgba(229,9,20,0.5)]"
            >
              {item.char}
            </span>
          );
        })}
      </p>
    </div>
  );
}

export default DecryptText;
