import React, { useState, useEffect, useRef, useCallback } from "react";
import MoneyRainCanvas from "@/components/cinematic/MoneyRainCanvas";
import InteractiveVault from "@/components/cinematic/InteractiveVault";
import VariableProximity from "@/components/ui/VariableProximity";
import { BlurFade } from "@/components/ui/BlurText";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export function TheLoot() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMoneyRaining, setIsMoneyRaining] = useState(false);

  // Active vault on hover or click: "01", "02", "03", or null
  const [hoveredVault, setHoveredVault] = useState(null);
  const [pinnedVault, setPinnedVault] = useState(null);

  const sectionRef = useRef(null);
  const lootHeaderRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Trigger cinematic sequence on initial scroll
  const triggerEntranceSequence = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setHasPlayed(true);

    if (!isReducedMotion) {
      setIsMoneyRaining(true);
      // Auto-preview middle vault on initial entrance
      setPinnedVault("01");
    }
  }, [isReducedMotion]);

  // Scroll detection via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          triggerEntranceSequence();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const target = sectionRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [triggerEntranceSequence]);

  /**
   * Hover & Click handlers:
   * When hovering over any vault, it opens immediately and triggers money rain.
   * Clicking toggles pinning the vault open.
   */
  const handleVaultHover = (id) => {
    setHoveredVault(id);
    if (!isMoneyRaining) {
      setIsMoneyRaining(true);
    }
  };

  const handleVaultLeave = () => {
    setHoveredVault(null);
  };

  const handleVaultToggle = (id) => {
    setPinnedVault((prev) => (prev === id ? null : id));
    if (!isMoneyRaining) {
      setIsMoneyRaining(true);
    }
  };

  return (
    <section
      id="loot"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] py-20 sm:py-28 md:py-32 px-4 sm:px-6 lg:px-12 border-t border-[#292929]/80 overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Background ambient lighting matching ThePlan and TheSchedule */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-[#E50914]/[0.035] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* ============================================================== */}
      {/* 3D MONEY RAIN PARTICLE ENGINE (CANVAS)                         */}
      {/* ============================================================== */}
      <MoneyRainCanvas
        isActive={isMoneyRaining}
        onComplete={() => setIsMoneyRaining(false)}
        isReducedMotion={isReducedMotion}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-center">

        {/* ============================================================== */}
        {/* TOP HEADER: INVENTORY · VAULT RESERVE & TOTAL HEIST BOUNTY (25K) */}
        {/* ============================================================== */}
        <div ref={lootHeaderRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 relative">
          {/* Left Title Block */}
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              INVENTORY · VAULT RESERVE
            </p>
            <h2 className="font-heist text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
              <VariableProximity
                label="THE LOOT"
                className="cursor-default"
                fromFontVariationSettings="'wght' 700, 'opsz' 30"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={lootHeaderRef}
                radius={130}
                falloff="linear"
              />
            </h2>
          </div>

          {/* Right Total Prize Pool Callout Box (Themed in Authentic Heist Red) */}
          <BlurFade delay={0.2}>
            <div className="relative p-5 sm:p-6 bg-[#111111] border border-[#292929] hover:border-[#E50914]/60 transition-all duration-300 shadow-[0_0_35px_rgba(0,0,0,0.8)] min-w-[240px] group overflow-hidden">
              {/* Top red laser accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_12px_#E50914]" />
              
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-[#E50914] font-bold uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                  TOTAL HEIST BOUNTY
                </span>
                <span className="font-mono text-[9px] text-[#666666] tracking-widest uppercase">
                  VAULT RESERVE
                </span>
              </div>

              <div className="font-heist text-4xl sm:text-5xl lg:text-6xl text-white tracking-wider block drop-shadow-[0_0_25px_rgba(229,9,20,0.65)]">
                <AnimatedCounter from={0} value={25000} prefix="₹" duration={2} glowOnComplete={true} />
              </div>

              <div className="mt-2 pt-2 border-t border-[#1f1f1f] flex items-center justify-between text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">
                <span>ROYAL MINT</span>
                <span className="text-[#E50914] font-semibold">100% UNLOCKED</span>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* ============================================================== */}
        {/* PODIUM VAULT LAYOUT: RANK 2 (LEFT) - RANK 1 (MIDDLE/FRONT) - RANK 3 (RIGHT) */}
        {/* Open while hovered, with Money Heist theme, prices, and names   */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-center justify-items-center mb-16">
          
          {/* VAULT 02: SECONDARY TARGET (RANK 2 - LEFT) */}
          <div className="w-full flex justify-center order-2 md:order-1">
            <InteractiveVault
              rank="02"
              title="2ND PRIZE · THE ESCAPE"
              amount="₹8,000"
              perk="+ RUNNER-UP TROPHY & MERCH"
              targetLabel="SECONDARY TARGET"
              statusLabel="BERLIN'S SHARE"
              accentColor="#E50914"
              isMiddle={false}
              isOpen={hoveredVault === "02" || (hoveredVault === null && pinnedVault === "02")}
              onHover={() => handleVaultHover("02")}
              onLeave={handleVaultLeave}
              onToggle={() => handleVaultToggle("02")}
              showUsb={false}
            />
          </div>

          {/* VAULT 01: PRIMARY TARGET (RANK 1 - MIDDLE & IN FRONT / PROMINENT) */}
          <div className="w-full flex justify-center order-1 md:order-2">
            <InteractiveVault
              rank="01"
              title="1ST PRIZE · THE MASTERMIND"
              amount="₹12,000"
              perk="+ WINNER’S TROPHY & DALI MASK"
              targetLabel="PRIMARY TARGET"
              statusLabel="THE PROFESSOR'S CUT"
              accentColor="#E50914"
              isMiddle={true}
              isOpen={hoveredVault === "01" || (hoveredVault === null && pinnedVault === "01")}
              onHover={() => handleVaultHover("01")}
              onLeave={handleVaultLeave}
              onToggle={() => handleVaultToggle("01")}
              showUsb={true}
            />
          </div>

          {/* VAULT 03: TERTIARY TARGET (RANK 3 - RIGHT) */}
          <div className="w-full flex justify-center order-3 md:order-3">
            <InteractiveVault
              rank="03"
              title="3RD PRIZE · THE INFILTRATOR"
              amount="₹5,000"
              perk="+ 3RD PLACE TROPHY & CERTIFICATE"
              targetLabel="TERTIARY TARGET"
              statusLabel="TOKYO'S SHARE"
              accentColor="#A3A3A3"
              isMiddle={false}
              isOpen={hoveredVault === "03" || (hoveredVault === null && pinnedVault === "03")}
              onHover={() => handleVaultHover("03")}
              onLeave={handleVaultLeave}
              onToggle={() => handleVaultToggle("03")}
              showUsb={false}
            />
          </div>

        </div>

        {/* ============================================================== */}
        {/* PARTICIPANT CERTIFICATE GUARANTEE BANNER                       */}
        {/* ============================================================== */}
        <div className="p-6 sm:p-8 bg-[#111111] border border-[#292929] hover:border-[#E50914]/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent" />
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-[#E50914] shrink-0 animate-pulse" />
            <div>
              <p className="font-heist text-lg sm:text-xl text-white tracking-wider uppercase">
                EVERY PARTICIPANT RECEIVES AN OFFICIAL E-CERTIFICATE
              </p>
              <p className="font-mono text-xs text-[#A3A3A3] tracking-wide mt-1">
                Issued with verified cryptographic proof of infiltration in the Royal Mint.
              </p>
            </div>
          </div>

          <span className="font-mono text-[11px] text-[#E50914] tracking-[0.25em] uppercase px-4 py-2 border border-[#E50914]/40 bg-[#E50914]/10 shrink-0 font-bold">
            OFFICIAL ACCREDITATION
          </span>
        </div>

      </div>
    </section>
  );
}

export default TheLoot;
