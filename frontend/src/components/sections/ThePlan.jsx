import React, { useRef } from "react";
import maskedHeistImg from "@/assets/images/masked-heist-nobg.png";
import crewImg from "@/assets/images/crew.png";
import VariableProximity from "@/components/ui/VariableProximity";
import { BlurText } from "@/components/ui/BlurText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export function ThePlan() {
  const planHeaderRef = useRef(null);

  const OBJECTIVES = [
    {
      step: "01",
      title: "GET IN",
      action: "Get in through the front doors at 08:00.",
      detail: "Pass security verification at the registration desk. Hardware deployed, all three crew members accounted for.",
    },
    {
      step: "02",
      title: "TAKE CONTROL",
      action: "Take control of the mint & solve the challenges.",
      detail: "Infiltrate Phase 1 inside the mint. Solve rapid development problems, decrypt data streams, and rank in the top 10.",
    },
    {
      step: "03",
      title: "PRINT THE LOOT",
      action: "Print what you came for before time expires.",
      detail: "Execute solutions with precision. Only the top 10 crews move on to Phase 2: The Escape.",
    },
    {
      step: "04",
      title: "GET OUT",
      action: "Get out before the walls close in.",
      detail: "Collect every hint in Phase 2. The first crew to unlock the final escape sequence claims the vault.",
    },
  ];

  return (
    <section
      id="plan"
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] pt-20 pb-28 md:pt-28 md:pb-36 px-6 lg:px-16 border-t border-[#292929]/80 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top classified document header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#292929] text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#A3A3A3]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <span className="text-[#E50914] font-semibold">MISSION DIRECTIVE</span>
            <span className="text-[#666666]">/</span>
            <span>OPERATION CODEVERSE 2.0</span>
          </div>
          <div className="flex items-center gap-4 text-[#666666]">
            <span>LOCATION: ROYAL MINT (DJSCE)</span>
            <span className="hidden sm:inline">CLEARANCE: LEVEL <AnimatedCounter from={0} value={5} duration={1} /></span>
          </div>
        </div>

        {/* Section title & Identity declaration */}
        <div ref={planHeaderRef} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 relative">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            TACTICAL PROTOCOL · 09.10
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            <VariableProximity
              label="THE PLAN"
              className="cursor-default"
              fromFontVariationSettings="'wght' 700, 'opsz' 30"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={planHeaderRef}
              radius={120}
              falloff="linear"
            />
          </h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-1">
            <BlurText
              text="YOU ARE NOT HACKATHON TEAMS."
              className="font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-[0.22em] uppercase"
              delay={0.15}
            />
            <BlurText
              text="YOU ARE THE CREW."
              className="font-heist text-xl sm:text-2xl text-[#E50914] tracking-widest uppercase font-bold drop-shadow-[0_0_20px_rgba(229,9,20,0.5)]"
              delay={0.3}
            />
          </div>
        </div>

        {/* Character leaning over the horizontal box */}
        <div className="relative flex justify-center">
          {/* Masked man leaning forward on his hands */}
          <div className="relative -mb-[2px] z-20 flex justify-center pointer-events-none select-none">
            <img
              src={maskedHeistImg}
              alt="Masked Heist Crew Member"
              className="w-64 sm:w-80 md:w-96 lg:w-[420px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* HORIZONTAL THE PLAN BOX (Directly underneath his hands) */}
        <div className="relative bg-[#111111] border border-[#292929] p-8 sm:p-12 shadow-2xl overflow-hidden">
          {/* Top red laser edge line where his hands rest */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_15px_#E50914]" />

          {/* Box Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#292929]">
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#E50914] tracking-[0.28em] uppercase font-bold block mb-1">
                OPERATIONAL BREAKDOWN
              </span>
              <h3 className="font-heist text-2xl sm:text-3xl text-white tracking-wider uppercase">
                FOUR STEPS. ZERO COMPROMISES.
              </h3>
            </div>
            <div className="font-mono text-[11px] text-[#A3A3A3] tracking-widest uppercase px-3.5 py-1.5 bg-[#171717] border border-[#292929] shrink-0 self-start sm:self-auto flex items-center gap-1.5">
              <span>CREWS OF</span>
              <AnimatedCounter from={0} value={3} className="text-[#E50914] font-bold" />
              <span>·</span>
              <AnimatedCounter from={0} value={10} className="text-[#E50914] font-bold" />
              <span>HOURS</span>
            </div>
          </div>

          {/* 4 Horizontal Step Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {OBJECTIVES.map((item, idx) => (
              <div
                key={item.step}
                className="relative p-6 bg-[#0c0c0c] border border-[#292929] hover:border-[#E50914]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#E50914] tracking-widest">
                      <AnimatedCounter from={0} value={parseInt(item.step, 10)} padDigits={2} duration={1.2} />
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#292929] group-hover:bg-[#E50914] transition-colors" />
                  </div>

                  <h4 className="font-heist text-xl text-white tracking-wider uppercase mb-2 group-hover:text-[#F5F2ED] transition-colors">
                    {item.title}
                  </h4>

                  <p className="font-sans text-sm text-[#F5F2ED] font-medium leading-snug mb-3">
                    {item.action}
                  </p>

                  <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a1a1a] flex items-center justify-between font-mono text-[10px] text-[#666666] tracking-widest uppercase">
                  <span>
                    PHASE <AnimatedCounter from={0} value={idx < 3 ? 1 : 2} padDigits={2} duration={0.8} />
                  </span>
                  <span className="text-[#E50914]">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Security Directives Banner */}
          <div className="mt-8 pt-6 border-t border-[#292929] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#666666] tracking-widest uppercase">
            <span>NO PHONES · NO NAMES · NO ROOM FOR ERROR</span>
            <span className="text-[#A3A3A3]">THE ROYAL MINT · 09.10.2026</span>
          </div>
        </div>

        {/* THE ODDS — Major Visual Moment (45 → 10 → 1) */}
        <div className="relative mt-12 sm:mt-16 p-8 sm:p-14 bg-[#111111] border border-[#292929] overflow-hidden">
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
                <AnimatedCounter
                  from={0}
                  value={45}
                  duration={1.8}
                  className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight block"
                />
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
                <AnimatedCounter
                  from={0}
                  value={10}
                  duration={1.8}
                  delay={0.25}
                  className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F5F2ED] tracking-tight block"
                />
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
                <AnimatedCounter
                  from={0}
                  value={1}
                  duration={1.5}
                  delay={0.5}
                  glowOnComplete={true}
                  className="font-heist text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#E50914] tracking-tight block drop-shadow-[0_0_40px_rgba(229,9,20,0.5)]"
                />
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
