import React from "react";

/**
 * GlitchText component from React Bits
 *
 * Provides a chromatic glitch effect with red and cyan split shadows,
 * tactical clip-path animations, and transparent background to match the theme seamlessly.
 */
const GlitchText = ({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className = "",
}) => {
  const isSmall =
    className.includes("text-xs") ||
    className.includes("text-sm") ||
    className.includes("text-base");

  const shadowOffset = isSmall ? "2px" : "4px";
  const shiftOffsetClass = isSmall
    ? {
        after: "after:left-[2px]",
        before: "before:left-[-2px]",
      }
    : {
        after: "after:left-[4px]",
        before: "before:left-[-4px]",
      };

  const inlineStyles = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? `-${shadowOffset} 0 #C8102E` : "none", // Money Heist red
    "--before-shadow": enableShadows ? `${shadowOffset} 0 #00ffff` : "none", // Cyan chromatic split
  };

  const hasTextSize = /text-(xs|sm|base|lg|xl|\d+xl|\[.+\])/.test(className);
  const baseClasses = `text-white ${
    hasTextSize ? "" : "text-[clamp(2.5rem,7vw,5.5rem)]"
  } font-black relative select-none cursor-pointer tracking-wider inline-block font-heist whitespace-nowrap`;

  // Using bg-transparent so no solid box is rendered, allowing the dark cinematic background to show through cleanly
  const pseudoClasses = !enableOnHover
    ? `after:content-[attr(data-text)] after:whitespace-nowrap after:absolute after:top-0 ${shiftOffsetClass.after} after:text-white after:bg-transparent after:overflow-hidden after:[clip-path:inset(0_0_0_0)] after:[text-shadow:var(--after-shadow)] after:animate-glitch-after ` +
      `before:content-[attr(data-text)] before:whitespace-nowrap before:absolute before:top-0 ${shiftOffsetClass.before} before:text-white before:bg-transparent before:overflow-hidden before:[clip-path:inset(0_0_0_0)] before:[text-shadow:var(--before-shadow)] before:animate-glitch-before`
    : `after:content-[''] after:whitespace-nowrap after:absolute after:top-0 ${shiftOffsetClass.after} after:text-white after:bg-transparent after:overflow-hidden after:[clip-path:inset(0_0_0_0)] after:opacity-0 ` +
      `before:content-[''] before:whitespace-nowrap before:absolute before:top-0 ${shiftOffsetClass.before} before:text-white before:bg-transparent before:overflow-hidden before:[clip-path:inset(0_0_0_0)] before:opacity-0 ` +
      `hover:after:content-[attr(data-text)] hover:after:opacity-100 hover:after:[text-shadow:var(--after-shadow)] hover:after:animate-glitch-after ` +
      `hover:before:content-[attr(data-text)] hover:before:opacity-100 hover:before:[text-shadow:var(--before-shadow)] hover:before:animate-glitch-before`;


  const combinedClasses = `${baseClasses} ${pseudoClasses} ${className}`;

  return (
    <span style={inlineStyles} data-text={children} className={combinedClasses}>
      {children}
    </span>
  );
};

export default GlitchText;

