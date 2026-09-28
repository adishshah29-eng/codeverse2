import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Vault cryptographic glyph pool (ASCII + numbers + symbols + Japanese katakana)
const GLYPHS =
  "#@$%0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾛﾜﾝ";

function generateScrambleChars(targetText, currentProgress) {
  const totalChars = targetText.length;
  const lockedCount = Math.floor(currentProgress * totalChars);

  return targetText.split("").map((originalChar, index) => {
    // Preserve spaces and linebreaks exactly
    if (originalChar === " " || originalChar === "\n") {
      return {
        char: originalChar,
        isLocked: true,
        isFrontier: false,
        isSpace: true,
      };
    }

    // Locked resolved character
    if (index < lockedCount || currentProgress >= 1) {
      return {
        char: originalChar,
        isLocked: true,
        isFrontier: false,
        isSpace: false,
      };
    }

    // Frontier character (currently resolving at the scanning front)
    if (index === lockedCount) {
      const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      return {
        char: randomGlyph,
        isLocked: false,
        isFrontier: true,
        isSpace: false,
      };
    }

    // Unresolved character ahead of the decrypt frontier
    const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    return {
      char: randomGlyph,
      isLocked: false,
      isFrontier: false,
      isSpace: false,
    };
  });
}

/**
 * useScrambleText
 * Hero vault text decryption hook.
 * Resolves characters from LEFT to RIGHT over `duration` ms.
 *
 * @param {string} targetText - The text to be decrypted
 * @param {boolean} active - When true, initiates the left-to-right decryption sequence
 * @param {object} options - { duration: number }
 */
export function useScrambleText(targetText = "", active = false, { duration = 900 } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(() => (shouldReduceMotion || !active ? 1 : 0));
  const [isScrambling, setIsScrambling] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(() => Boolean(shouldReduceMotion || !active));
  const [chars, setChars] = useState(() =>
    generateScrambleChars(targetText, shouldReduceMotion || !active ? 1 : 0)
  );

  const startTimeRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    if (active) {
      startTimeRef.current = null;

      const animate = (timestamp) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
          setIsScrambling(true);
          setIsDecrypted(false);
        }
        const elapsed = timestamp - startTimeRef.current;
        const currentProgress = Math.min(1, elapsed / duration);

        setProgress(currentProgress);
        setChars(generateScrambleChars(targetText, currentProgress));

        if (currentProgress < 1) {
          rafIdRef.current = requestAnimationFrame(animate);
        } else {
          setIsScrambling(false);
          setIsDecrypted(true);
          setChars(generateScrambleChars(targetText, 1));
        }
      };

      rafIdRef.current = requestAnimationFrame(animate);
    } else {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    }

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [active, duration, targetText, shouldReduceMotion]);

  const displayText = chars.map((c) => c.char).join("");

  return {
    displayText,
    chars,
    isScrambling,
    isDecrypted,
    progress,
  };
}

export default useScrambleText;
