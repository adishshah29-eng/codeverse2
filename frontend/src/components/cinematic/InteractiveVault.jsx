import React, { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import vaultClosedImg from "@/assets/images/vault_closed_hd.png";
import vaultOpenImg from "@/assets/images/vault_open_hd.png";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

/**
 * Synthesizes a realistic mechanical bank vault lock & bolt sound via Web Audio API.
 * Works seamlessly without downloading external audio files.
 */
function playVaultSound(isOpenAction) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Pin 1: Dial click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(isOpenAction ? 950 : 600, now);
    osc1.frequency.exponentialRampToValueAtTime(isOpenAction ? 200 : 800, now + 0.06);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.06);

    // Pin 2: Heavy mechanical steel bolt sliding
    setTimeout(() => {
      if (ctx.state === "closed") return;
      const t = ctx.currentTime;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(isOpenAction ? 280 : 160, t);
      osc2.frequency.exponentialRampToValueAtTime(isOpenAction ? 45 : 110, t + 0.28);
      gain2.gain.setValueAtTime(0.3, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.28);
    }, 80);
  } catch (err) {
    // Audio contexts might be blocked until user gesture, safely ignore
  }
}

/**
 * InteractiveVault
 * 
 * Renders an authentic heavy steel safe vault:
 * - Closed state with combinations, lock wheels, bolts
 * - Smooth 3D mechanical door swing when clicked
 * - Inside chamber fitted with cash bundles, prize pool details, perks, and badges
 * - Middle vault (Rank 1) is scaled up, positioned forward in the layout hierarchy
 */
export function InteractiveVault({
  rank = "01",
  title = "1ST PRIZE",
  amount = "₹25,000",
  perk = "+ THE WINNER’S TROPHY",
  targetLabel = "PRIMARY TARGET",
  statusLabel = "SECURED VAULT 01",
  accentColor = "#C9A227",
  isMiddle = false,
  isOpen = false,
  onToggle,
  showUsb = true,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    playVaultSound(!isOpen);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 900);
    if (onToggle) onToggle();
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none transition-all duration-700 ${
        isMiddle
          ? "z-20 md:-translate-y-4 lg:-translate-y-6 scale-100 sm:scale-105 lg:scale-110"
          : "z-10 scale-95 sm:scale-100 opacity-90 hover:opacity-100"
      }`}
    >
      {/* Top Header Label */}
      <div className="text-center mb-3">
        <p
          className="font-mono text-[11px] sm:text-xs tracking-[0.25em] font-bold uppercase transition-colors duration-300"
          style={{ color: isOpen ? accentColor : isMiddle ? "#E50914" : "#A3A3A3" }}
        >
          {isOpen ? `ACCESSED VAULT ${rank}` : `${targetLabel} - ${statusLabel}`}
        </p>
      </div>

      {/* Main Safe Box Frame */}
      <div
        onClick={handleClick}
        className={`relative cursor-pointer group rounded-sm transition-all duration-500 ${
          isMiddle && isOpen
            ? "shadow-[0_0_50px_rgba(201,162,39,0.35)]"
            : isOpen
            ? "shadow-[0_0_35px_rgba(229,9,20,0.25)]"
            : "hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
        }`}
        style={{
          width: "100%",
          maxWidth: isMiddle ? "380px" : "330px",
          aspectRatio: isOpen ? "284 / 214" : "206 / 214",
        }}
        title={`Click to ${isOpen ? "seal" : "open"} Vault ${rank}`}
      >
        {/* ========================================================= */}
        {/* BASE LAYER: OPEN VAULT CHAMBER (Revealed when open)     */}
        {/* ========================================================= */}
        <div
          className={`absolute inset-0 transition-opacity duration-600 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Base Open Vault Graphic */}
          <img
            src={vaultOpenImg}
            alt={`Open Vault ${rank}`}
            className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* Ambient Warm Glow inside chamber */}
          <div
            className="absolute top-[18%] left-[16%] w-[48%] h-[50%] rounded-full blur-[24px] pointer-events-none transition-opacity duration-700"
            style={{
              backgroundColor: isMiddle
                ? "rgba(201, 162, 39, 0.25)"
                : "rgba(229, 9, 20, 0.2)",
            }}
          />

          {/* Fitted Prize Information Inside the Vault Chamber */}
          <div className="absolute top-[14%] left-[14%] w-[46%] h-[50%] flex flex-col justify-center items-center text-center p-1.5 z-10">
            {/* Rank Tag */}
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] font-extrabold uppercase px-2 py-0.5 border rounded-xs mb-1"
              style={{
                color: accentColor,
                borderColor: `${accentColor}55`,
                backgroundColor: `${accentColor}18`,
              }}
            >
              {title}
            </span>

            {/* Cash Prize Typography */}
            <div
              className="font-heist text-xl sm:text-2xl lg:text-3xl tracking-wide font-black leading-tight drop-shadow-[0_0_12px_rgba(0,0,0,0.9)]"
              style={{
                color: isMiddle ? "#F5F2ED" : "#FFFFFF",
                textShadow: isMiddle ? "0 0 16px rgba(201,162,39,0.7)" : "0 0 14px rgba(229,9,20,0.6)",
              }}
            >
              {isOpen ? (
                <AnimatedCounter
                  value={parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0}
                  prefix="₹"
                  duration={1.2}
                />
              ) : (
                amount
              )}
            </div>

            {/* Perk / Trophy */}
            <span className="font-mono text-[8px] sm:text-[9px] tracking-wider text-neutral-300 font-semibold uppercase mt-1 leading-tight line-clamp-1">
              {perk}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TOP LAYER: CLOSED VAULT DOOR (Swings open in 3D)         */}
        {/* ========================================================= */}
        <div
          className={`absolute inset-0 transition-all duration-800 ease-out origin-right ${
            isOpen
              ? "opacity-0 pointer-events-none [transform:perspective(1200px)_rotateY(-78deg)_scale(0.92)]"
              : "opacity-100 pointer-events-auto [transform:perspective(1200px)_rotateY(0deg)_scale(1)]"
          }`}
          style={{
            transformOrigin: "right center",
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease 0.25s",
          }}
        >
          <img
            src={vaultClosedImg}
            alt={`Closed Vault ${rank}`}
            className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
          />

          {/* Interactive Wheel Hover Dial Indicator */}
          <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 group-hover:border-[#E50914]/50 pointer-events-none transition-all duration-300 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_#E50914]" />
          </div>
        </div>

        {/* Subtle Lock Click Pulse Ring */}
        {isAnimating && (
          <div
            className="absolute inset-0 border-2 rounded-sm pointer-events-none animate-ping"
            style={{ borderColor: accentColor }}
          />
        )}
      </div>

      {/* Bottom Footer Label */}
      <div className="text-center mt-3">
        <p className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-[#A3A3A3] uppercase">
          {isOpen ? `VAULT ${rank}: CONTENTS REVEALED` : `VAULT ${rank}: SECURE STORAGE`}
        </p>

        {/* Click to open / close hint button */}
        <button
          onClick={handleClick}
          className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 bg-[#121212] border border-[#2a2a2a] hover:border-[#E50914] text-neutral-400 hover:text-white transition-all cursor-pointer rounded-xs"
        >
          {isOpen ? (
            <Lock className="w-3 h-3 text-[#E50914]" />
          ) : (
            <Unlock className="w-3 h-3" style={{ color: accentColor }} />
          )}
          <span>{isOpen ? "SEAL VAULT" : "CLICK TO UNLOCK"}</span>
        </button>
      </div>
    </div>
  );
}

export default InteractiveVault;
