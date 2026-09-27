import React, { useState, useEffect } from "react";
import djsceCctv from "@/assets/images/djsce_cctv.png";

export function TheMint() {
  const [mapType, setMapType] = useState("satellite"); // 'satellite' | 'roadmap'
  const [zoom, setZoom] = useState(19);
  const [reticleLocked, setReticleLocked] = useState(true);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Synchronized Military / Live Clocks
  const [liveTime, setLiveTime] = useState("09:41:27");
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 32, seconds: 17 });

  const mapsSearchUrl =
    "https://www.google.com/maps/search/?api=1&query=4R5Q%2B235+Dwarkadas+Jivanlal+Sanghvi+College+Of+Engineering";
  const mapsDirectionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=4R5Q%2B235+Dwarkadas+Jivanlal+Sanghvi+College+Of+Engineering";

  // Clock & Countdown timer loops
  useEffect(() => {
    // Remove any previous Google Maps SDK script to prevent "Do you own this website?" modal
    const oldScript = document.getElementById("google-maps-api-script");
    if (oldScript) {
      oldScript.remove();
    }

    const clockInterval = setInterval(() => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      setLiveTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    }, 1000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        let totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) totalSeconds = 4 * 3600 + 32 * 60 + 17; // loop fallback
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  // Recenter and zoom to target
  const handleRecenterTarget = () => {
    setReticleLocked(true);
    setZoom(19);
  };

  // Zoom controls
  const handleZoom = (delta) => {
    setZoom((prev) => Math.max(15, Math.min(21, prev + delta)));
  };

  // Copy coordinates to clipboard
  const handleCopyCoords = () => {
    navigator.clipboard.writeText("4R5Q+235 Dwarkadas Jivanlal Sanghvi College Of Engineering (19.1075° N, 72.8372° E)");
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2200);
  };

  // Access target location
  const handleAccessLocation = () => {
    handleRecenterTarget();
    window.open(mapsDirectionsUrl, "_blank", "noopener,noreferrer");
  };

  const padNumber = (n) => String(n).padStart(2, "0");

  // Google Maps Satellite / Roadmap Embed URL (100% error-free, pinpointed to Plus Code 4R5Q+235)
  const embedMapUrl = `https://maps.google.com/maps?q=4R5Q%2B235+Dwarkadas+Jivanlal+Sanghvi+College+Of+Engineering&t=${
    mapType === "satellite" ? "k" : "m"
  }&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="mint"
      className="relative w-full bg-[#000000] text-[#f3f4f6] py-16 sm:py-24 px-4 sm:px-6 lg:px-12 border-t border-[#1a1a1a] overflow-hidden select-none"
    >
      {/* Scoped CSS Keyframes for Military Radar & Target HUD */}
      <style>{`
        @keyframes mintRadarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes mintRadarPing {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes mintReticlePulse {
          0%, 100% {
            border-color: rgba(229, 9, 20, 0.95);
            box-shadow: 0 0 20px rgba(229, 9, 20, 0.5), inset 0 0 15px rgba(229, 9, 20, 0.25);
          }
          50% {
            border-color: rgba(255, 45, 60, 0.45);
            box-shadow: 0 0 8px rgba(229, 9, 20, 0.2), inset 0 0 5px rgba(229, 9, 20, 0.1);
          }
        }
        .mint-radar-beam {
          background: conic-gradient(from 0deg, rgba(229, 9, 20, 0.45) 0deg, transparent 65deg);
          animation: mintRadarSweep 4.2s linear infinite;
        }
        .mint-reticle-box {
          animation: mintReticlePulse 2.4s ease-in-out infinite;
        }
        .mint-stencil-distress {
          text-shadow:
            0 0 25px rgba(255,255,255,0.2),
            0 2px 0 #000000,
            0 0 50px rgba(229,9,20,0.25);
        }
      `}</style>

      {/* Background Military Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(229, 9, 20, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 9, 20, 0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient Crimson Vignettes */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[350px] bg-red-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ================= TOP HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          
          {/* Left Title Block */}
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-2">
              <span>THE PROFESSOR'S FILE</span>
              <span className="text-neutral-600">·</span>
              <span className="text-white">04</span>
            </div>

            <h2 className="font-heist text-5xl sm:text-7xl md:text-8xl tracking-widest text-[#F5F2ED] uppercase mint-stencil-distress leading-none my-1">
              THE MINT
            </h2>

            <p className="font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-neutral-400 font-medium mt-3">
              THE TARGET HAS BEEN IDENTIFIED.
            </p>
          </div>

          {/* Right Live Registration Countdown Badge */}
          <div className="flex items-center self-start md:self-auto gap-2.5 px-4 py-2 bg-[#090909] border border-[#262626] font-mono text-xs sm:text-sm tracking-[0.22em] text-[#E50914] shadow-[0_0_20px_rgba(0,0,0,0.9)]">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-ping shrink-0" />
            <span className="font-bold text-white tracking-widest">REGISTRATION OPEN</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-light">CLOSES IN</span>
            <span className="font-bold text-[#E50914] tracking-widest font-mono">
              {padNumber(countdown.hours)}:{padNumber(countdown.minutes)}:{padNumber(countdown.seconds)}
            </span>
          </div>

        </div>

        {/* Red Kicker Line with Label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#E50914] font-bold shrink-0">
            TARGET COORDINATES · LOCATION
          </span>
          <div className="h-[1px] bg-red-600/35 flex-1" />
        </div>

        {/* ================= 3-COLUMN TACTICAL HUD GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* ----------------- LEFT COLUMN (4 COLS) ----------------- */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Top Target Details Card */}
            <div className="flex-1 bg-[#060606] border border-[#222222] p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-[0_0_35px_rgba(0,0,0,0.85)]">
              
              {/* Corner Tactical Brackets */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-red-600/50 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-red-600/50 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-red-600/50 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-red-600/50 pointer-events-none" />

              <div>
                {/* Sector Secure Badge + Plus Code */}
                <div className="flex flex-wrap items-center gap-2.5 mb-5 font-mono text-[10px] tracking-[0.22em] uppercase">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/40 border border-red-600/60 text-[#E50914] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                    SECTOR SECURE
                  </div>
                  <span className="text-neutral-500">·</span>
                  <span className="text-white font-bold">PLUS CODE: 4R5Q+235</span>
                  <span className="text-neutral-500">·</span>
                  <span className="text-neutral-400">PIN: 400056</span>
                </div>

                {/* College Title */}
                <h3 className="font-heist text-xl sm:text-2xl md:text-3xl text-white tracking-wider uppercase leading-tight mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  DWARKADAS JIVANLAL SANGHVI<br />
                  COLLEGE OF ENGINEERING
                </h3>

                {/* Location Address with Red Pin */}
                <div className="flex items-start gap-3 text-neutral-300 font-sans text-xs sm:text-sm leading-relaxed mb-6">
                  <svg
                    className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <div>
                    <p className="font-medium text-neutral-200">Bhaktivedanta Swami Marg</p>
                    <p className="text-neutral-400">Vile Parle (West), Mumbai</p>
                    <p className="text-neutral-400">Maharashtra · 400056 [Plus Code: 4R5Q+235]</p>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="h-[1px] bg-[#1c1c1c] my-5" />

                {/* Operation Date & Registration Desk */}
                <div className="grid grid-cols-2 gap-4 font-mono text-xs tracking-wider uppercase mb-7">
                  <div>
                    <span className="text-neutral-500 text-[10px] block mb-1">OPERATION DATE</span>
                    <span className="text-neutral-200 font-semibold">09 OCTOBER 2026</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block mb-1">REGISTRATION DESK</span>
                    <span className="text-[#E50914] font-bold">OPENS AT 08:00</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAccessLocation}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#E50914] hover:bg-[#ff1a26] text-white font-mono text-xs sm:text-sm tracking-[0.24em] uppercase font-bold transition-all duration-300 shadow-[0_0_25px_rgba(229,9,20,0.45)] hover:shadow-[0_0_35px_rgba(229,9,20,0.7)] cursor-pointer border border-red-500"
                >
                  <span className="text-sm">↗</span>
                  <span>ACCESS TARGET LOCATION</span>
                  <span>→</span>
                </button>

                <div className="text-center">
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-neutral-400 hover:text-white transition-colors"
                  >
                    <span>OPEN IN GOOGLE MAPS</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Mission Data Card */}
            <div className="bg-[#060606] border border-[#222222] p-4 relative overflow-hidden">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-[#E50914] uppercase font-semibold mb-3">
                <span className="tracking-tighter font-bold">///</span>
                <span>MISSION DATA</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs uppercase">
                <div className="border-r border-[#1a1a1a] pr-1">
                  <span className="text-[9px] text-neutral-500 block">TARGET</span>
                  <span className="text-neutral-200 font-bold">DJSCE</span>
                </div>
                <div className="border-r border-[#1a1a1a] pr-1">
                  <span className="text-[9px] text-neutral-500 block">CITY</span>
                  <span className="text-neutral-200 font-bold">MUMBAI</span>
                </div>
                <div className="border-r border-[#1a1a1a] pr-1">
                  <span className="text-[9px] text-neutral-500 block">STATUS</span>
                  <span className="text-[#E50914] font-bold animate-pulse">CONFIRMED</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-500 block">SECTOR</span>
                  <span className="text-neutral-200 font-bold">LEVEL 03</span>
                </div>
              </div>
            </div>

          </div>

          {/* ----------------- CENTER COLUMN (5 COLS): LIVE MAP & SATELLITE ----------------- */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Top Google Map Satellite Container */}
            <div className="relative bg-[#000000] border border-[#292929] overflow-hidden flex flex-col h-[380px] sm:h-[420px] lg:h-[430px] shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              
              {/* Map HUD Header Bar */}
              <div className="bg-[#080808]/90 backdrop-blur-sm border-b border-[#222222] px-3.5 py-2 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-400 z-20">
                
                {/* Cam & Signal */}
                <div className="flex items-center gap-3">
                  <span className="text-neutral-200 font-bold">CAM 07 · SATELLITE</span>
                  <div className="hidden sm:flex items-center gap-1 text-[9px] text-neutral-400">
                    <span>SIGNAL 98%</span>
                    <div className="flex gap-0.5 items-end h-2.5">
                      <div className="w-1 h-1 bg-[#E50914]" />
                      <div className="w-1 h-1.5 bg-[#E50914]" />
                      <div className="w-1 h-2 bg-[#E50914]" />
                      <div className="w-1 h-2.5 bg-[#E50914]" />
                    </div>
                  </div>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMapType("satellite")}
                    className={`px-2 py-0.5 text-[9px] tracking-widest font-semibold transition-all cursor-pointer ${
                      mapType === "satellite"
                        ? "bg-[#E50914] text-white"
                        : "bg-[#141414] text-neutral-400 hover:text-white"
                    }`}
                  >
                    SATELLITE
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapType("roadmap")}
                    className={`px-2 py-0.5 text-[9px] tracking-widest font-semibold transition-all cursor-pointer ${
                      mapType === "roadmap"
                        ? "bg-[#E50914] text-white"
                        : "bg-[#141414] text-neutral-400 hover:text-white"
                    }`}
                  >
                    NOIR
                  </button>
                </div>

                {/* Live Feed Clock */}
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 hidden sm:inline">LIVE FEED</span>
                  <span className="text-neutral-200 font-mono font-bold">{liveTime}</span>
                </div>

              </div>

              {/* The Official Google Map Live Satellite Embed (No API Key Required, No Auth Errors) */}
              <div className="relative w-full flex-1 overflow-hidden bg-black">
                <iframe
                  title="Google Maps Location - Dwarkadas J. Sanghvi College of Engineering"
                  src={embedMapUrl}
                  className="w-full h-full border-0 absolute inset-0"
                  style={{
                    filter:
                      mapType === "satellite"
                        ? "contrast(1.15) brightness(0.9) saturate(0.85)"
                        : "invert(90%) hue-rotate(180deg) contrast(1.3) brightness(0.8)",
                  }}
                  loading="lazy"
                  allowFullScreen
                />

                {/* Tactical CRT Scanline Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 opacity-25"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
                    backgroundSize: "100% 3px, 6px 100%",
                  }}
                />

                {/* Edge Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    boxShadow: "inset 0 0 60px 25px #000000",
                  }}
                />

                {/* ============= CENTER TARGET LOCK RETICLE (Matching Screenshot) ============= */}
                {reticleLocked && (
                  <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                    
                    {/* Bounding Box with Corner Notches */}
                    <div className="relative w-36 h-28 sm:w-44 sm:h-32 mint-reticle-box border border-red-600/80 flex items-center justify-center">
                      
                      {/* Red Corner Accents */}
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-red-500" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-red-500" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-red-500" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-red-500" />

                      {/* Concentric Pulsing Bullseye Circles */}
                      <div className="relative flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border border-red-500/80 animate-ping absolute" />
                        <div className="w-6 h-6 rounded-full border border-red-500/90 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_12px_#E50914]" />
                        </div>
                      </div>

                      {/* Angled Callout Line pointing to "TARGET LOCK" Badge */}
                      <div className="absolute -top-7 -right-14 sm:-right-20 flex items-center gap-1.5 pointer-events-auto">
                        <div className="w-8 sm:w-12 h-[1px] bg-red-600/90 transform rotate-[-25deg] origin-left" />
                        <div className="px-2 py-0.5 bg-[#E50914] text-white font-mono text-[9px] sm:text-[10px] tracking-widest font-bold shadow-[0_0_12px_rgba(229,9,20,0.8)] uppercase">
                          TARGET LOCK
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* Bottom Right Coordinates Telemetry Badge */}
                <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handleCopyCoords}
                    title="Click to copy coordinates"
                    className="flex flex-col items-end px-3 py-1.5 bg-[#000000]/85 border border-[#2e2e2e] hover:border-red-600/70 font-mono text-[10px] tracking-[0.2em] text-neutral-300 transition-colors shadow-lg cursor-pointer text-right backdrop-blur-sm"
                  >
                    <span className="text-white font-semibold">19.1075° N</span>
                    <span className="text-neutral-400">72.8372° E</span>
                    {copiedCoords && (
                      <span className="text-[8px] text-[#E50914] font-bold">COPIED TO CLIPBOARD!</span>
                    )}
                  </button>
                </div>

                {/* Interactive Map Quick-Controls: Zoom & Recenter */}
                <div className="absolute top-12 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => handleZoom(1)}
                    className="w-7 h-7 bg-black/85 hover:bg-neutral-900 border border-[#2e2e2e] text-neutral-200 font-mono text-sm flex items-center justify-center transition-colors shadow"
                    title="Zoom in"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoom(-1)}
                    className="w-7 h-7 bg-black/85 hover:bg-neutral-900 border border-[#2e2e2e] text-neutral-200 font-mono text-sm flex items-center justify-center transition-colors shadow"
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={handleRecenterTarget}
                    className="w-7 h-7 bg-black/85 hover:bg-neutral-900 border border-[#2e2e2e] text-[#E50914] font-mono text-sm flex items-center justify-center transition-colors shadow"
                    title="Recenter DJSCE"
                    aria-label="Recenter DJSCE"
                  >
                    ⊙
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom CAM 07 Surveillance Feed (Real DJSCE Entrance Gate) */}
            <div className="bg-[#060606] border border-[#222222] p-3 relative overflow-hidden flex flex-col sm:flex-row items-center gap-3">
              
              {/* CAM 07 Image using the user's uploaded real DJSCE gate photo */}
              <div className="relative w-full sm:w-44 h-24 sm:h-20 shrink-0 overflow-hidden border border-[#262626] bg-black">
                <img
                  src={djsceCctv}
                  alt="DJSCE Entrance Gate Surveillance"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:scale-105 transition-transform duration-500"
                />
                
                {/* Surveillance REC indicator */}
                <div className="absolute top-1 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/70 font-mono text-[8px] text-[#E50914] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
                  REC
                </div>

                <div className="absolute bottom-1 right-1.5 font-mono text-[8px] text-white/80 bg-black/70 px-1">
                  {liveTime}
                </div>
              </div>

              {/* Feed Meta */}
              <div className="w-full font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] tracking-widest uppercase mb-1">
                  <span className="text-[#E50914] font-bold">CAM 07 · ENTRANCE CHECKPOINT</span>
                  <span>FEED ACTIVE</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-tight font-sans">
                  DJSCE Ground Level Security Gate · Vile Parle Mumbai
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[9px] text-neutral-500 uppercase">
                  <span>RESOL: 1080P IR</span>
                  <span>·</span>
                  <span>ENCRYPTED RTSP</span>
                </div>
              </div>

            </div>

          </div>

          {/* ----------------- RIGHT COLUMN (3 COLS): RADAR & TELEMETRY ----------------- */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            
            {/* Top Radar Screen Display */}
            <div className="flex-1 bg-[#060606] border border-[#222222] p-5 relative overflow-hidden flex flex-col items-center justify-between shadow-[0_0_35px_rgba(0,0,0,0.85)]">
              
              {/* Radar Header */}
              <div className="w-full flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase mb-4">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                  <span>SATELLITE LINK</span>
                </div>
                <span className="text-[#E50914] font-bold">TARGET LOCKED</span>
              </div>

              {/* The Circular Animated Radar Screen */}
              <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-red-950/60 bg-[#020202] flex items-center justify-center my-3 shadow-[inset_0_0_30px_rgba(229,9,20,0.2)]">
                
                {/* Rotating Conic Gradient Radar Sweep */}
                <div className="absolute inset-0 rounded-full mint-radar-beam pointer-events-none" />

                {/* Concentric Radar Range Rings */}
                <div className="absolute w-40 h-40 rounded-full border border-[#202020] pointer-events-none" />
                <div className="absolute w-28 h-28 rounded-full border border-[#202020] pointer-events-none" />
                <div className="absolute w-16 h-16 rounded-full border border-[#202020] pointer-events-none" />

                {/* Crosshairs & Axes */}
                <div className="absolute w-full h-[1px] bg-[#222222] pointer-events-none" />
                <div className="absolute h-full w-[1px] bg-[#222222] pointer-events-none" />

                {/* Compass Cardinal Points */}
                <span className="absolute top-1 font-mono text-[9px] text-[#E50914] font-bold">N</span>
                <span className="absolute bottom-1 font-mono text-[9px] text-neutral-500 font-bold">S</span>
                <span className="absolute right-2 font-mono text-[9px] text-neutral-500 font-bold">E</span>
                <span className="absolute left-2 font-mono text-[9px] text-neutral-500 font-bold">W</span>

                {/* Center Target Blip with Ripple Waves */}
                <div className="relative z-10 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full border border-[#E50914] absolute pointer-events-none"
                    style={{ animation: "mintRadarPing 2.5s ease-out infinite" }}
                  />
                  <div
                    className="w-20 h-20 rounded-full border border-[#E50914]/50 absolute pointer-events-none"
                    style={{ animation: "mintRadarPing 2.5s ease-out infinite 0.8s" }}
                  />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E50914] shadow-[0_0_18px_#E50914]" />
                </div>

              </div>

              {/* Coordinates Telemetry under Radar */}
              <div className="w-full text-center font-mono text-xs text-neutral-300 tracking-[0.22em] uppercase mt-2 pt-3 border-t border-[#1c1c1c]">
                <div className="flex items-center justify-center gap-1.5 text-neutral-200 font-bold">
                  <span className="text-[#E50914]">⌖</span>
                  <span>19.1075° N</span>
                </div>
                <div className="text-neutral-400 text-[11px] mt-0.5">
                  72.8372° E
                </div>
                <div className="text-[9px] text-neutral-500 tracking-widest mt-1">
                  ELEV: 14M · BEARING: 284°
                </div>
              </div>

            </div>

            {/* Bottom Operation Codeverse Card */}
            <div className="bg-[#060606] border border-[#222222] p-4 relative overflow-hidden flex items-center justify-between">
              
              {/* Red Hazard Stripes */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-8 opacity-75 shrink-0"
                  style={{
                    background:
                      "repeating-linear-gradient(-45deg, #E50914, #E50914 4px, transparent 4px, transparent 8px)",
                  }}
                />
                <div className="font-mono uppercase text-left">
                  <span className="text-white text-xs font-bold tracking-wider block">
                    OPERATION CODEVERSE
                  </span>
                  <span className="text-[#E50914] text-[10px] tracking-widest font-semibold">
                    TARGET ACQUIRED
                  </span>
                </div>
              </div>

              {/* Hex Target Glyph */}
              <div className="w-6 h-6 border border-[#E50914] rotate-45 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-[#E50914]" />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default TheMint;
