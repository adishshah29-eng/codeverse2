import React from "react";

export function TheBriefing() {
  return (
    <section
      id="briefing"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Top classified document header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-16 border-b border-[#292929] text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-[#A3A3A3]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            <span className="text-[#E50914] font-semibold">CLASSIFIED TRANSCRIPT</span>
            <span className="text-[#666666]">/</span>
            <span>FILE: BRF-0910</span>
          </div>
          <div className="flex items-center gap-4 text-[#666666]">
            <span>LOCATION: TOLEDO ESTATE</span>
            <span className="hidden sm:inline">CLEARANCE: LEVEL 5</span>
          </div>
        </div>

        {/* Section title & kicker */}
        <div className="mb-16 md:mb-24">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            TRANSCRIPT · FARMHOUSE, FIVE MONTHS AGO
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            THE BRIEFING
          </h2>
        </div>

        {/* Editorial Narrative Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Metadata & Objective Directive */}
          <div className="lg:col-span-4 space-y-10 order-2 lg:order-1">
            {/* Objective box - tactical mission stamp */}
            <div className="p-8 border border-[#292929] bg-[#111111]/80 backdrop-blur-sm relative">
              <div className="absolute top-0 left-0 w-8 h-[2px] bg-[#E50914]" />
              <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#E50914] mb-3">
                MISSION DIRECTIVE
              </div>
              <h3 className="font-heist text-xl sm:text-2xl tracking-wide uppercase text-white mb-6">
                YOUR OBJECTIVE
              </h3>
              
              <ul className="space-y-4 font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-wide">
                <li className="flex items-start gap-3">
                  <span className="text-[#E50914] font-bold">01.</span>
                  <span>Get in through the front doors at 08:00.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E50914] font-bold">02.</span>
                  <span>Take control of the mint & solve the challenges.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E50914] font-bold">03.</span>
                  <span>Print what you came for before time expires.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#E50914] font-bold">04.</span>
                  <span>Get out before the walls close in.</span>
                </li>
              </ul>
            </div>

            {/* Crew declaration callout */}
            <div className="border-l-2 border-[#E50914] pl-6 py-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#666666] mb-1">
                IDENTITY PROTOCOL
              </p>
              <p className="font-heist text-lg sm:text-xl text-white tracking-wide uppercase">
                YOU ARE NOT HACKATHON TEAMS.
              </p>
              <p className="font-heist text-2xl sm:text-3xl text-[#E50914] tracking-wide uppercase font-bold mt-1">
                YOU ARE THE CREW.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Body Transcript */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            <div className="text-lg sm:text-xl md:text-2xl text-[#F5F2ED] font-light leading-relaxed space-y-6">
              <p>
                It’s been five months since he found you.
              </p>
              <p className="text-[#A3A3A3]">
                No names. No pasts. Just a knock on the door, and a man who called himself{" "}
                <span className="text-white font-medium">The Professor</span>.
              </p>
              <p className="text-[#A3A3A3]">
                He trained you. No phones. No families. No room for error.
              </p>
              <p className="text-[#F5F2ED]">
                Today, the training ends. <span className="text-[#E50914] font-normal">Today, you go in.</span>
              </p>
              <p className="text-base sm:text-lg text-[#A3A3A3] pt-4 border-t border-[#292929]">
                The Royal Mint holds the one machine that prints currency that has never officially existed. Control it, and you decide what money even means.
              </p>
            </div>

            {/* Featured cinematic quote */}
            <div className="pt-8">
              <blockquote className="relative p-6 sm:p-8 bg-[#171717]/60 border-l-4 border-[#E50914]">
                <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#F5F2ED] leading-snug">
                  “Once you’re inside, the plan is only as good as the crew executing it.”
                </p>
                <footer className="mt-4 font-mono text-xs tracking-[0.25em] text-[#A3A3A3] uppercase">
                  — The Professor
                </footer>
              </blockquote>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default TheBriefing;
