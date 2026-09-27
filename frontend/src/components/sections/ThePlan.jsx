import React from "react";
import crewImg from "@/assets/images/crew.png";

export function ThePlan() {
  return (
    <section
      id="plan"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            BLUEPRINT · PROTOCOL 09.10
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            THE PLAN
          </h2>
          <p className="font-sans text-lg sm:text-xl md:text-2xl text-[#A3A3A3] max-w-3xl mt-4 font-light">
            Two phases. The first gets you inside. The second decides who gets out.
          </p>
        </div>

        {/* Two Phases with Cinematic Tactical Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* PHASE 01 */}
          <div className="group relative p-8 sm:p-10 bg-[#111111] border border-[#292929] hover:border-[#E50914]/60 transition-all duration-500">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#292929]">
              <span className="font-mono text-xs tracking-[0.25em] text-[#E50914] uppercase font-bold">
                PHASE 01
              </span>
              <span className="font-mono text-xs text-[#A3A3A3] tracking-widest">
                10:00 AM – 1:30 PM
              </span>
            </div>

            <h3 className="font-heist text-2xl sm:text-3xl text-white uppercase tracking-wider mb-4">
              INSIDE THE MINT
            </h3>

            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed mb-8 font-light">
              You’ve entered the Royal Mint. The Professor briefed you on the tasks. Complete them fast, and complete them right. Only the top 10 crews move on.
            </p>

            {/* Classified Security Stamp */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-red-950/30 border border-[#E50914]/40 text-[#E50914] font-mono text-[11px] tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
              <span>TASK DETAILS CLASSIFIED UNTIL THE BRIEFING.</span>
            </div>
          </div>

          {/* PHASE 02 */}
          <div className="group relative p-8 sm:p-10 bg-[#111111] border border-[#292929] hover:border-[#E50914]/60 transition-all duration-500">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#292929]">
              <span className="font-mono text-xs tracking-[0.25em] text-[#E50914] uppercase font-bold">
                PHASE 02
              </span>
              <span className="font-mono text-xs text-[#A3A3A3] tracking-widest">
                2:30 PM – 4:30 PM
              </span>
            </div>

            <h3 className="font-heist text-2xl sm:text-3xl text-white uppercase tracking-wider mb-4">
              THE ESCAPE
            </h3>

            <p className="text-sm sm:text-base text-[#A3A3A3] leading-relaxed mb-8 font-light">
              You’re out of the mint, but not out of trouble. Every decision matters. You either escape, or you get caught. The first crew to collect every hint wins.
            </p>

            {/* Classified Security Stamp */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-red-950/30 border border-[#E50914]/40 text-[#E50914] font-mono text-[11px] tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
              <span>TASK DETAILS CLASSIFIED UNTIL THE BRIEFING.</span>
            </div>
          </div>

        </div>

        {/* THE ODDS — Major Visual Moment (45 → 10 → 1) */}
        <div className="relative p-8 sm:p-14 bg-[#111111] border border-[#292929] overflow-hidden">
          {/* Subtle Crew image blended on the left side with heavy gradient */}
          <div
            className="absolute -left-10 top-0 bottom-0 w-2/5 opacity-15 pointer-events-none hidden md:block"
            style={{
              backgroundImage: `url(${crewImg})`,
              backgroundSize: "cover",
              backgroundPosition: "left center",
              maskImage: "linear-gradient(to right, black 20%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 20%, transparent 100%)",
            }}
          />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-[#E50914] font-semibold mb-6">
              SURVIVAL PROBABILITY · THE ODDS
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 my-8">
              
              {/* Step 1: 45 Crews Enter */}
              <div className="flex-1 text-center group">
                <span className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight block">
                  45
                </span>
                <span className="font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-[0.25em] uppercase mt-2 block font-medium">
                  CREWS ENTER
                </span>
              </div>

              {/* Arrow 1 */}
              <div className="text-[#E50914] text-3xl md:text-4xl animate-pulse font-mono rotate-90 md:rotate-0">
                →
              </div>

              {/* Step 2: 10 Reach Phase 2 */}
              <div className="flex-1 text-center group">
                <span className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F5F2ED] tracking-tight block">
                  10
                </span>
                <span className="font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-[0.25em] uppercase mt-2 block font-medium">
                  REACH PHASE 2
                </span>
              </div>

              {/* Arrow 2 */}
              <div className="text-[#E50914] text-3xl md:text-4xl animate-pulse font-mono rotate-90 md:rotate-0">
                →
              </div>

              {/* Step 3: 1 Walks Out */}
              <div className="flex-1 text-center group">
                <span className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#E50914] tracking-tight block drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]">
                  1
                </span>
                <span className="font-mono text-xs sm:text-sm text-[#E50914] tracking-[0.25em] uppercase mt-2 block font-bold">
                  WALKS OUT
                </span>
              </div>

            </div>

            <p className="font-mono text-xs text-[#666666] tracking-[0.2em] uppercase mt-8 pt-6 border-t border-[#292929]">
              ONLY THE FIRST CREW TO COLLECT EVERY HINT IN PHASE 2 TAKES THE VAULT.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ThePlan;
