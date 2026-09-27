import React, { useState, useEffect, useRef, useCallback } from "react";
import { Lock, Unlock, Coins } from "lucide-react";
import MoneyRainCanvas from "@/components/cinematic/MoneyRainCanvas";
import InteractiveVault from "@/components/cinematic/InteractiveVault";

export function TheLoot() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMoneyRaining, setIsMoneyRaining] = useState(false);

  // Exclusively one active open vault at a time: "01", "02", "03", or null
  const [activeVault, setActiveVault] = useState("01");

  const sectionRef = useRef(null);
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
      // Ensure Vault 01 (Middle) opens smoothly with the entrance money rain
      setTimeout(() => {
        setActiveVault("01");
      }, 500);
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
   * Exclusive Vault Toggle:
   * When clicking a vault, if another vault was already open, it automatically closes!
   * Clicking the currently open vault toggles it shut.
   */
  const handleVaultClick = (id) => {
    if (activeVault === id) {
      // Toggle closed if user clicks the currently opened vault
      setActiveVault(null);
    } else {
      // Automatically closes the previous vault and opens the clicked one!
      setActiveVault(id);
      if (!isMoneyRaining) {
        setIsMoneyRaining(true);
      }
    }
  };

  const handleCloseAll = () => {
    setActiveVault(null);
  };

  const handleReplayRain = () => {
    setIsMoneyRaining(true);
  };

  return (
    <section
      id="loot"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#080808] text-[#F5F2ED] py-20 sm:py-28 md:py-32 px-4 sm:px-6 lg:px-12 border-t border-[#222222] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Scoped CSS for authentic brushed metal texture and vault lighting */}
      <style>{`
        .heist-brushed-metal {
          background-color: #070707;
          background-image: 
            radial-gradient(ellipse at 50% 15%, rgba(229, 9, 20, 0.08) 0%, transparent 65%),
            radial-gradient(ellipse at 50% 85%, rgba(201, 162, 39, 0.05) 0%, transparent 55%),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.015) 0px,
              rgba(255, 255, 255, 0.015) 1px,
              transparent 1px,
              transparent 3px
            );
        }
        .laser-sweep-line {
          animation: laserSweep 3.5s ease-in-out infinite;
        }
        @keyframes laserSweep {
          0% { transform: translateY(-100%); opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0.1; }
        }
      `}</style>

      {/* Brushed Dark Metal Background Overlay */}
      <div className="absolute inset-0 heist-brushed-metal pointer-events-none" />

      {/* Ambient Crimson Vignettes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-amber-950/15 rounded-full blur-[140px] pointer-events-none" />

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
        {/* TOP HEADER: INVENTORY · VAULT RESERVE & TOTAL PRINTED RESERVE  */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          {/* Left Title Block */}
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              INVENTORY · VAULT RESERVE
            </p>
            <h2 className="font-heist text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
              THE LOOT
            </h2>
          </div>

          {/* Right Total Prize Pool Callout Box */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="p-5 sm:p-6 bg-[#111111]/90 border border-[#262626] backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)] min-w-[220px]">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#A3A3A3] uppercase block mb-1">
                TOTAL PRINTED RESERVE
              </span>
              <span className="font-heist text-4xl sm:text-5xl text-[#C9A227] tracking-wider block drop-shadow-[0_0_20px_rgba(201,162,39,0.35)]">
                ₹50,000
              </span>
            </div>

            {/* Quick Action Toggle Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 self-start md:self-end">
              <div className="flex items-center gap-1 bg-[#121212] p-1 border border-[#262626]">
                <button
                  onClick={() => handleVaultClick("02")}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer rounded-xs ${
                    activeVault === "02"
                      ? "bg-[#E50914] text-white font-bold shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Open Vault 02 (2nd Prize)"
                >
                  02 · 2ND
                </button>
                <button
                  onClick={() => handleVaultClick("01")}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer rounded-xs ${
                    activeVault === "01"
                      ? "bg-[#C9A227] text-black font-extrabold shadow-[0_0_15px_rgba(201,162,39,0.6)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Open Vault 01 (1st Prize)"
                >
                  01 · 1ST
                </button>
                <button
                  onClick={() => handleVaultClick("03")}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer rounded-xs ${
                    activeVault === "03"
                      ? "bg-neutral-300 text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Open Vault 03 (3rd Prize)"
                >
                  03 · 3RD
                </button>
              </div>

              {activeVault && (
                <button
                  onClick={handleCloseAll}
                  className="px-2.5 py-1 bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#E50914] text-[10px] font-mono tracking-widest uppercase text-neutral-400 hover:text-white transition-all cursor-pointer rounded-xs flex items-center gap-1.5"
                  title="Seal active vault"
                >
                  <Lock className="w-3 h-3 text-[#E50914]" />
                  <span>SEAL</span>
                </button>
              )}

              <button
                onClick={handleReplayRain}
                className="px-2.5 py-1 bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#E50914] text-[10px] font-mono tracking-widest uppercase text-neutral-400 hover:text-white transition-all cursor-pointer rounded-xs flex items-center justify-center gap-1.5"
                title="Trigger money rain"
              >
                <Coins className="w-3 h-3 text-[#C9A227]" />
                <span>RAIN</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PODIUM VAULT LAYOUT: RANK 2 (LEFT) - RANK 1 (MIDDLE/FRONT) - RANK 3 (RIGHT) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-center justify-items-center mb-16">
          
          {/* VAULT 02: SECONDARY TARGET (RANK 2 - LEFT) */}
          <div className="w-full flex justify-center order-2 md:order-1">
            <InteractiveVault
              rank="02"
              title="2ND PRIZE"
              amount="₹15,000"
              perk="+ RUNNER-UP TROPHY"
              targetLabel="SECONDARY TARGET"
              statusLabel="SECURED VAULT 02"
              accentColor="#E50914"
              isMiddle={false}
              isOpen={activeVault === "02"}
              onToggle={() => handleVaultClick("02")}
              showUsb={false}
            />
          </div>

          {/* VAULT 01: PRIMARY TARGET (RANK 1 - MIDDLE & IN FRONT / PROMINENT) */}
          <div className="w-full flex justify-center order-1 md:order-2">
            <InteractiveVault
              rank="01"
              title="1ST PRIZE"
              amount="₹25,000"
              perk="+ THE WINNER’S TROPHY"
              targetLabel="PRIMARY TARGET"
              statusLabel="SECURED VAULT 01"
              accentColor="#C9A227"
              isMiddle={true}
              isOpen={activeVault === "01"}
              onToggle={() => handleVaultClick("01")}
              showUsb={true}
            />
          </div>

          {/* VAULT 03: TERTIARY TARGET (RANK 3 - RIGHT) */}
          <div className="w-full flex justify-center order-3 md:order-3">
            <InteractiveVault
              rank="03"
              title="3RD PRIZE"
              amount="₹10,000"
              perk="+ THIRD PLACE TROPHY"
              targetLabel="TERTIARY TARGET"
              statusLabel="SECURED VAULT 03"
              accentColor="#A3A3A3"
              isMiddle={false}
              isOpen={activeVault === "03"}
              onToggle={() => handleVaultClick("03")}
              showUsb={false}
            />
          </div>

        </div>

        {/* ============================================================== */}
        {/* PARTICIPANT CERTIFICATE GUARANTEE BANNER                       */}
        {/* ============================================================== */}
        <div className="p-6 sm:p-8 bg-[#121212]/90 border border-[#262626] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-[#E50914] shrink-0 animate-pulse" />
            <div>
              <p className="font-heist text-lg sm:text-xl text-white tracking-wider uppercase">
                EVERY PARTICIPANT RECEIVES AN E-CERTIFICATE
              </p>
              <p className="font-mono text-xs text-[#A3A3A3] tracking-wide mt-1">
                Issued with verified cryptographic proof of deployment in the Royal Mint.
              </p>
            </div>
          </div>

          <span className="font-mono text-[11px] text-[#C9A227] tracking-[0.2em] uppercase px-4 py-2 border border-[#C9A227]/30 bg-[#C9A227]/5 shrink-0">
            OFFICIAL ACCREDITATION
          </span>
        </div>

      </div>
    </section>
  );
}

export default TheLoot;
