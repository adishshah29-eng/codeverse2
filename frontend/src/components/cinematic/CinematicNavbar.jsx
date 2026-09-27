import React from "react";
import GlitchText from "./GlitchText";

/**
 * CinematicNavbar
 *
 * Glassmorphic top navigation with:
 * - Translucent blurred background allowing the cinematic background to be seen through
 * - Navigation elements: THE BRIEFING, THE PLAN, THE LOOT
 * - Interactive smooth scrolling to corresponding story scenes
 * - Active state tracking based on scroll progress
 */
export function CinematicNavbar({ progress = 0, onNavigate, visible }) {
  const scrollToScene = (ratio) => {
    if (onNavigate) {
      onNavigate(ratio);
      return;
    }
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      window.scrollTo({ top: ratio * docHeight, behavior: "smooth" });
    }
  };

  const isNavbarVisible = visible !== undefined ? visible : progress >= 0.25;

  // Active section calculation
  const isBriefingActive = progress < 0.35;
  const isPlanActive = progress >= 0.35 && progress < 0.75;
  const isLootActive = progress >= 0.75;

  return (
    <nav
      aria-label="Cinematic Navigation"
      className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/35 border-b border-white/10 transition-all duration-700 ease-out ${
        isNavbarVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between select-none">
        {/* Left minimal branding */}
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
          <GlitchText
            speed={0.8}
            enableShadows={true}
            enableOnHover={false}
            className="font-heist text-xs sm:text-sm tracking-[0.18em] text-white font-bold uppercase"
          >
            CODEVERSE 2.0
          </GlitchText>
        </div>


        {/* Center / Navigation items: THE BRIEFING, THE PLAN, THE LOOT */}
        <div className="flex items-center space-x-6 sm:space-x-10 font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase">
          <button
            type="button"
            onClick={() => scrollToScene(0.04)}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              isBriefingActive
                ? "text-white font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            THE BRIEFING
            {isBriefingActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollToScene(0.48)}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              isPlanActive
                ? "text-white font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            THE PLAN
            {isPlanActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollToScene(0.92)}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              isLootActive
                ? "text-white font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            THE LOOT
            {isLootActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Right status indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
          <span className="opacity-60">PHASE:</span>
          <span className="text-red-500 font-semibold">
            {isBriefingActive ? "01" : isPlanActive ? "02" : "03"}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default CinematicNavbar;
