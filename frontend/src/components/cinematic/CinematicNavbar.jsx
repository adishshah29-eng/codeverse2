import React, { useState, useEffect } from "react";

/**
 * CinematicNavbar
 *
 * Preserves the exact visual design:
 * - Glassmorphic top navigation with backdrop-blur-md bg-black/60 border-b border-white/10
 * - Left branding: red pulsing beacon + CODEVERSE 2.0
 * - Navigation links connected to:
 *   - The Briefing (#briefing)
 *   - The Plan (#plan)
 *   - Schedule (#schedule)
 *   - The Loot (#loot)
 *   - Rules (#rules)
 *   - Join the crew (#enter)
 */
export function CinematicNavbar({ progress = 0, visible, isIntroCompleted = false }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ["briefing", "plan", "schedule", "loot", "rules", "enter"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
      setActiveSection("hero");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isNavbarVisible = isIntroCompleted ? true : visible !== undefined ? visible : progress >= 0.86;

  return (
    <nav
      aria-label="Cinematic Navigation"
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10 transition-all duration-700 ease-out ${
        isNavbarVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between select-none">
        
        {/* Left minimal branding - click to scroll top */}
        <button
          type="button"
          onClick={() => scrollTo("top")}
          className="flex items-center gap-2.5 cursor-pointer group text-left"
        >
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse shrink-0" />
          <span className="font-heist text-xs sm:text-sm tracking-[0.18em] text-white font-bold uppercase whitespace-nowrap group-hover:text-[#E50914] transition-colors">
            CODEVERSE 2.0
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-mono text-[11px] tracking-[0.2em] uppercase">
          <button
            type="button"
            onClick={() => scrollTo("briefing")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "briefing"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            THE BRIEFING
            {activeSection === "briefing" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("plan")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "plan"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            THE PLAN
            {activeSection === "plan" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("schedule")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "schedule"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            SCHEDULE
            {activeSection === "schedule" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("loot")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "loot"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            THE LOOT
            {activeSection === "loot" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollTo("rules")}
            className={`relative py-1 transition-all duration-300 cursor-pointer ${
              activeSection === "rules"
                ? "text-white font-bold"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            RULES
            {activeSection === "rules" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50914] rounded-full" />
            )}
          </button>
        </div>

        {/* Right CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo("enter")}
            className="px-4 py-1.5 bg-[#E50914] hover:bg-[#FF1A1A] text-white font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] cursor-pointer whitespace-nowrap"
          >
            JOIN THE CREW →
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white font-mono text-base"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-[#292929] px-6 py-6 font-mono text-xs tracking-widest uppercase space-y-4">
          <button
            type="button"
            onClick={() => scrollTo("briefing")}
            className="block w-full text-left py-2 text-[#A3A3A3] hover:text-white"
          >
            THE BRIEFING
          </button>
          <button
            type="button"
            onClick={() => scrollTo("plan")}
            className="block w-full text-left py-2 text-[#A3A3A3] hover:text-white"
          >
            THE PLAN
          </button>
          <button
            type="button"
            onClick={() => scrollTo("schedule")}
            className="block w-full text-left py-2 text-[#A3A3A3] hover:text-white"
          >
            SCHEDULE
          </button>
          <button
            type="button"
            onClick={() => scrollTo("loot")}
            className="block w-full text-left py-2 text-[#A3A3A3] hover:text-white"
          >
            THE LOOT
          </button>
          <button
            type="button"
            onClick={() => scrollTo("rules")}
            className="block w-full text-left py-2 text-[#A3A3A3] hover:text-white"
          >
            RULES
          </button>
          <button
            type="button"
            onClick={() => scrollTo("enter")}
            className="block w-full text-left py-2 text-[#E50914] font-bold"
          >
            JOIN THE CREW →
          </button>
        </div>
      )}
    </nav>
  );
}

export default CinematicNavbar;
