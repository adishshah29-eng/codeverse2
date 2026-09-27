import React from "react";

export function TheMint() {
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=Dwarkadas+J.+Sanghvi+College+of+Engineering+Vile+Parle+Mumbai";

  return (
    <section
      id="mint"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            TARGET COORDINATES · LOCATION
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            THE MINT
          </h2>
        </div>

        {/* Dark Tactical Location Blueprint Panel */}
        <div className="relative p-8 sm:p-14 bg-[#111111] border border-[#292929] overflow-hidden">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#292929 1px, transparent 1px), linear-gradient(90deg, #292929 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Location Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-red-950/40 border border-[#E50914]/40 font-mono text-[10px] text-[#E50914] tracking-[0.25em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
                SECTOR SECURE · ACCESS CODE: 400056
              </div>

              <h3 className="font-heist text-2xl sm:text-3xl md:text-4xl text-white tracking-wider uppercase leading-tight">
                Dwarkadas J. Sanghvi College of Engineering
              </h3>

              <p className="font-sans text-base sm:text-lg text-[#A3A3A3] font-light leading-relaxed">
                Bhaktivedanta Swami Marg, Vile Parle (West), Mumbai, Maharashtra 400056
              </p>

              <div className="pt-4 border-t border-[#292929] flex flex-wrap items-center gap-6 font-mono text-xs text-[#666666] tracking-widest uppercase">
                <div>
                  <span className="text-[#A3A3A3] block">DATE:</span>
                  <span className="text-white font-semibold">9 OCTOBER 2026</span>
                </div>
                <div>
                  <span className="text-[#A3A3A3] block">REGISTRATION DESK:</span>
                  <span className="text-[#E50914] font-semibold">OPENS AT 08:00</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#E50914] hover:bg-[#FF1A1A] text-white font-mono text-xs tracking-widest uppercase font-bold transition-all shadow-[0_0_25px_rgba(229,9,20,0.35)]"
                >
                  <span>OPEN IN GOOGLE MAPS</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Right Tactical Radar Display */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[#0c0c0c] border border-[#292929] text-center">
              {/* Radar circular sweeps */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#292929] flex items-center justify-center mb-6">
                <div className="absolute w-36 h-36 rounded-full border border-[#292929]" />
                <div className="absolute w-20 h-20 rounded-full border border-[#292929]" />
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-[#292929]" />
                <div className="absolute h-full w-[1px] bg-[#292929]" />
                
                {/* Target Pulsing Beacon */}
                <div className="relative z-10 w-4 h-4 rounded-full bg-[#E50914] shadow-[0_0_20px_#E50914] animate-pulse" />
              </div>

              <div className="font-mono text-xs text-[#A3A3A3] tracking-[0.25em] uppercase">
                COORDINATES: <span className="text-white font-bold">19.1075° N, 72.8372° E</span>
              </div>
              <p className="font-mono text-[10px] text-[#666666] tracking-widest uppercase mt-1">
                ELEVATION: 14M · SATELLITE LOCK ACQUIRED
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default TheMint;
