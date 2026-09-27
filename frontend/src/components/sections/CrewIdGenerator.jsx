import React, { useState, useRef } from "react";

const CODENAMES = [
  "Tokyo",
  "Berlin",
  "Nairobi",
  "Rio",
  "Denver",
  "Helsinki",
  "Oslo",
  "Moscow",
  "Lisbon",
  "Palermo",
  "Bogota",
  "Manila",
  "Stockholm",
  "Marseille",
];

export function CrewIdGenerator() {
  const [name, setName] = useState("");
  const [assignedCrew, setAssignedCrew] = useState(null);
  const [copied, setCopied] = useState(false);
  const cardCanvasRef = useRef(null);

  const getRandomHex = () =>
    Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    const randomIndex = Math.floor(Math.random() * CODENAMES.length);
    const chosenCodename = CODENAMES[randomIndex];
    const generatedId = `CV2-1009-${getRandomHex()}`;

    setAssignedCrew({
      name: trimmed,
      codename: chosenCodename,
      id: generatedId,
      timestamp: new Date().toLocaleDateString("en-GB"),
    });
  };

  const handleRollAgain = () => {
    if (!name.trim()) return;
    const currentCode = assignedCrew?.codename;
    const pool = CODENAMES.filter((c) => c !== currentCode);
    const chosenCodename = pool[Math.floor(Math.random() * pool.length)];
    const generatedId = `CV2-1009-${getRandomHex()}`;

    setAssignedCrew((prev) => ({
      ...prev,
      codename: chosenCodename,
      id: generatedId,
    }));
  };

  // Client-side HTML5 canvas image export
  const handleDownload = () => {
    if (!assignedCrew) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    // Dark classified card background
    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#292929";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Red top security accent
    ctx.fillStyle = "#E50914";
    ctx.fillRect(30, 30, canvas.width - 60, 10);

    // Header metadata
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 24px monospace";
    ctx.fillText("CLASSIFIED PERSONNEL DOSSIER", 70, 95);

    ctx.fillStyle = "#666666";
    ctx.font = "18px monospace";
    ctx.fillText("OPERATION CODEVERSE · ROYAL MINT INFILTRATION", 70, 130);

    // Red Watermark Stamp
    ctx.save();
    ctx.translate(canvas.width - 240, 220);
    ctx.rotate(-0.15);
    ctx.strokeStyle = "rgba(229, 9, 20, 0.4)";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, 200, 70);
    ctx.fillStyle = "rgba(229, 9, 20, 0.4)";
    ctx.font = "bold 32px monospace";
    ctx.fillText("CLASSIFIED", 15, 48);
    ctx.restore();

    // Fields
    ctx.fillStyle = "#A3A3A3";
    ctx.font = "16px monospace";
    ctx.fillText("CREW MEMBER NAME", 70, 220);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(assignedCrew.name.toUpperCase(), 70, 275);

    ctx.fillStyle = "#A3A3A3";
    ctx.font = "16px monospace";
    ctx.fillText("ASSIGNED CODENAME", 70, 355);
    ctx.fillStyle = "#E50914";
    ctx.font = "bold 64px 'Black Ops One', sans-serif";
    ctx.fillText(assignedCrew.codename.toUpperCase(), 70, 425);

    ctx.fillStyle = "#A3A3A3";
    ctx.font = "16px monospace";
    ctx.fillText("CREW OPERATIONAL ID", 70, 495);
    ctx.fillStyle = "#C9A227";
    ctx.font = "bold 32px monospace";
    ctx.fillText(assignedCrew.id, 70, 540);

    // Footer
    ctx.fillStyle = "#444444";
    ctx.fillRect(30, canvas.height - 90, canvas.width - 60, 1);
    ctx.fillStyle = "#666666";
    ctx.font = "16px monospace";
    ctx.fillText("09.10.2026 · DJSCE MUMBAI · @DJSCODEAI", 70, canvas.height - 45);

    // Download trigger
    const link = document.createElement("a");
    link.download = `CODEVERSE-ID-${assignedCrew.codename.toUpperCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleShare = async () => {
    if (!assignedCrew) return;

    const shareText = `${assignedCrew.codename}, reporting for duty. Join our crew for CodeVerse 2.0, a Money Heist themed event on 9 October at DJSCE. Teams of 3. ₹99.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "CodeVerse 2.0 · Crew ID",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="crew-id"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            PERSONNEL FILE · RECRUITMENT
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl tracking-wider text-[#F5F2ED] uppercase">
            GET YOUR CREW ID
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#A3A3A3] mt-4 font-light">
            Every member of the crew gets a codename. Type your name, see who you are on the job, and send it to your team.
          </p>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleGenerate} className="max-w-xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Mehta"
              className="flex-1 px-5 py-4 bg-[#111111] border border-[#292929] focus:border-[#E50914] text-white font-mono text-sm tracking-wide outline-none placeholder:text-[#666666] transition-all"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#E50914] hover:bg-[#FF1A1A] text-white font-mono text-xs tracking-widest uppercase font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] shrink-0 cursor-pointer"
            >
              ASSIGN CODENAME
            </button>
          </div>
        </form>

        {/* Generated Classified Personnel File Card */}
        {assignedCrew && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Success Welcome Prompt */}
            <div className="text-center mb-6">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#A3A3A3]">
                WELCOME TO THE CREW,{" "}
                <span className="text-[#E50914] font-bold">
                  {assignedCrew.codename.toUpperCase()}
                </span>
                .
              </span>
            </div>

            {/* Tactical Card */}
            <div className="relative p-8 sm:p-12 bg-[#111111] border border-[#292929] shadow-2xl relative overflow-hidden">
              {/* Top Red Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#E50914]" />

              {/* Watermark Classified Stamp */}
              <div className="absolute right-6 top-8 sm:top-12 border-2 border-[#E50914]/30 px-3 py-1 text-[#E50914]/40 font-mono text-xs tracking-[0.3em] uppercase -rotate-6 select-none pointer-events-none">
                CLASSIFIED
              </div>

              {/* Card Header */}
              <div className="pb-6 mb-8 border-b border-[#292929] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#E50914] font-bold tracking-[0.25em] uppercase block">
                    CREW FILE
                  </span>
                  <span className="font-mono text-[10px] text-[#A3A3A3] tracking-widest uppercase">
                    OPERATION CODEVERSE · 09.10
                  </span>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[10px] text-[#666666] tracking-[0.25em] uppercase block mb-1">
                    NAME
                  </span>
                  <span className="font-sans text-xl sm:text-2xl text-white font-medium tracking-wide">
                    {assignedCrew.name}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#666666] tracking-[0.25em] uppercase block mb-1">
                    CODENAME
                  </span>
                  <span className="font-heist text-4xl sm:text-5xl text-[#E50914] tracking-wider uppercase block">
                    {assignedCrew.codename}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-[#666666] tracking-[0.25em] uppercase block mb-1">
                    ID
                  </span>
                  <span className="font-mono text-base sm:text-lg text-[#C9A227] tracking-widest font-bold">
                    {assignedCrew.id}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-8 mt-8 border-t border-[#292929] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#666666] tracking-widest uppercase">
                <span>09.10.2026 · DJSCE MUMBAI</span>
                <span>@DJSCODEAI</span>
              </div>
            </div>

            {/* Action Buttons: Roll Again, Download, Share */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={handleRollAgain}
                className="px-5 py-3 bg-[#171717] hover:bg-[#222222] border border-[#292929] hover:border-[#A3A3A3] text-xs font-mono tracking-widest uppercase text-[#F5F2ED] transition-all cursor-pointer"
              >
                ROLL AGAIN ⟳
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-3 bg-[#E50914] hover:bg-[#FF1A1A] text-white text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] cursor-pointer"
              >
                DOWNLOAD CARD ↓
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="px-5 py-3 bg-[#171717] hover:bg-[#222222] border border-[#292929] hover:border-[#A3A3A3] text-xs font-mono tracking-widest uppercase text-[#F5F2ED] transition-all cursor-pointer"
              >
                {copied ? "COPIED TO CLIPBOARD ✓" : "SHARE WITH CREW ↗"}
              </button>
            </div>

            <p className="text-center font-mono text-[11px] text-[#666666] tracking-wide mt-6">
              Made in your browser. Nothing is uploaded.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default CrewIdGenerator;
