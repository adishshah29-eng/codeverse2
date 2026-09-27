import React, { useState, useEffect } from "react";
import { getRegistrationStatus } from "@/lib/registrationStatus";

export function FinalCta() {
  const [status, setStatus] = useState(getRegistrationStatus());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const update = () => setStatus(getRegistrationStatus());
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    const shareText =
      "The Professor has a plan. All he needs is your crew. Join CodeVerse 2.0 at DJSCE Mumbai on 9 October. Teams of 3. ₹99.";
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CodeVerse 2.0 · The Heist",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback
      }
    }

    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="enter"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-32 md:py-48 px-6 lg:px-16 border-t border-[#292929] overflow-hidden text-center"
    >
      {/* Heavy red ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-900/15 rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Dynamic status pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8 bg-[#111111] border border-[#292929] text-[11px] font-mono text-[#E50914] tracking-[0.25em] uppercase">
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
          <span>{status.statusText}</span>
        </div>

        {/* Major Headline */}
        <h2 className="font-heist text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase mb-8 leading-none">
          ENTER THE MINT
        </h2>

        {/* Narrative Callout */}
        <div className="text-xl sm:text-2xl md:text-3xl text-[#F5F2ED] font-light leading-relaxed mb-12 space-y-2">
          <p>The Professor has a plan.</p>
          <p className="text-[#E50914] font-medium">All he needs is your crew.</p>
        </div>

        {/* Event Credentials */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-mono text-xs sm:text-sm text-[#A3A3A3] tracking-widest uppercase mb-14">
          <div>
            <span className="text-[#666666] block text-[10px]">VENUE</span>
            <span className="text-white">DJSCE MUMBAI</span>
          </div>
          <div className="hidden sm:block text-[#292929]">|</div>
          <div>
            <span className="text-[#666666] block text-[10px]">REGISTRATION</span>
            <span className="text-[#C9A227]">₹99 PER CREW</span>
          </div>
          <div className="hidden sm:block text-[#292929]">|</div>
          <div>
            <span className="text-[#666666] block text-[10px]">CREW SIZE</span>
            <span className="text-white">STRICTLY 3 MEMBERS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          {status.canRegister ? (
            <a
              href="https://unstop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-[#E50914] hover:bg-[#FF1A1A] text-white font-mono text-xs sm:text-sm tracking-widest uppercase font-bold transition-all shadow-[0_0_30px_rgba(229,9,20,0.4)] text-center cursor-pointer"
            >
              JOIN THE CREW ON UNSTOP →
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto px-10 py-5 bg-[#171717] border border-[#292929] text-[#666666] font-mono text-xs sm:text-sm tracking-widest uppercase cursor-not-allowed text-center"
            >
              {status.buttonText}
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto px-8 py-5 bg-[#111111] hover:bg-[#1a1a1a] border border-[#292929] hover:border-[#A3A3A3] text-xs sm:text-sm font-mono tracking-widest uppercase text-[#F5F2ED] transition-all cursor-pointer text-center"
          >
            {copied ? "COPIED DISPATCH ✓" : "SEND THIS TO YOUR CREW ↗"}
          </button>
        </div>

      </div>
    </section>
  );
}

export default FinalCta;
