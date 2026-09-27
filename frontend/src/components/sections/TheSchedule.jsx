import React, { useState, useEffect } from "react";

const TIMELINE = [
  {
    start: "08:00",
    end: "09:00",
    title: "Crew Registration Window",
    desc: "Verification of crew credentials and hardware deployment at the security checkpoint.",
    isPhase: false,
  },
  {
    start: "09:00",
    end: "09:30",
    title: "Opening Ceremony & Rules Briefing",
    desc: "The Professor's final broadcast. Decryption keys and challenge packets released.",
    isPhase: false,
  },
  {
    start: "10:00",
    end: "13:30",
    title: "PHASE 1 · INSIDE THE MINT",
    desc: "All 45 crews enter. Rapid development and tactical problem solving. Top 10 advance.",
    isPhase: true,
  },
  {
    start: "13:30",
    end: "14:30",
    title: "Break · Reset for the Next Phase",
    desc: "Recalibration, reconnaissance, and security lockdown before the escape phase begins.",
    isPhase: false,
  },
  {
    start: "14:30",
    end: "16:30",
    title: "PHASE 2 · THE ESCAPE",
    desc: "Top 10 crews hunt and solve under pressure. First to collect every hint walks out.",
    isPhase: true,
  },
  {
    start: "16:30",
    end: "17:15",
    title: "Final Score Evaluation",
    desc: "Verification of cryptographic proofs, code integrity, and hint acquisition logs.",
    isPhase: false,
  },
  {
    start: "17:15",
    end: "18:00",
    title: "Prize Distribution",
    desc: "Vault distribution: trophies, cash loot awarded, and e-certificates released.",
    isPhase: false,
  },
];

export function TheSchedule() {
  const [activeSlotIdx, setActiveSlotIdx] = useState(-1);

  // Check if today is 9 Oct 2026 and compute active slot
  useEffect(() => {
    const checkNow = () => {
      const now = new Date();
      const isEventDay =
        now.getFullYear() === 2026 &&
        now.getMonth() === 9 && // October (0-indexed: 9)
        now.getDate() === 9;

      if (!isEventDay) {
        setActiveSlotIdx(-1);
        return;
      }

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const idx = TIMELINE.findIndex((slot) => {
        const [sh, sm] = slot.start.split(":").map(Number);
        const [eh, em] = slot.end.split(":").map(Number);
        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;
        return currentMinutes >= startMin && currentMinutes < endMin;
      });

      setActiveSlotIdx(idx);
    };

    checkNow();
    const interval = setInterval(checkNow, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate iCalendar (.ics) file
  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CodeVerse//The Heist//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:codeverse-2026-heist@djsce",
      "DTSTAMP:20260927T000000Z",
      "DTSTART:20261009T023000Z", // 08:00 IST in UTC (02:30 UTC)
      "DTEND:20261009T123000Z",   // 18:00 IST in UTC (12:30 UTC)
      "SUMMARY:CodeVerse 2.0 · The Heist",
      "DESCRIPTION:CodeVerse 2.0 Money Heist Themed Hackathon at DJSCE Mumbai. 10 hours. Teams of 3.",
      "LOCATION:Dwarkadas J. Sanghvi College of Engineering, Vile Parle (W), Mumbai",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CodeVerse-2.0-The-Heist.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openGoogleCalendar = () => {
    const title = encodeURIComponent("CodeVerse 2.0 · The Heist");
    const details = encodeURIComponent(
      "CodeVerse 2.0 Money Heist Themed Hackathon at DJSCE Mumbai. 10 hours. Teams of 3. ₹25,000 prize pool."
    );
    const location = encodeURIComponent(
      "Dwarkadas J. Sanghvi College of Engineering, Vile Parle (West), Mumbai"
    );
    const dates = "20261009T023000Z/20261009T123000Z";
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`,
      "_blank"
    );
  };

  return (
    <section
      id="schedule"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
              09 OCTOBER · 10 HOURS
            </p>
            <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
              THE SCHEDULE
            </h2>
            <p className="font-sans text-lg sm:text-xl text-[#A3A3A3] mt-3 font-light">
              Crews of 3. Be through the door on time.
            </p>
          </div>

          {/* Calendar Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={downloadIcs}
              className="px-5 py-2.5 bg-[#171717] hover:bg-[#222222] border border-[#292929] hover:border-[#E50914]/60 text-xs font-mono tracking-widest uppercase text-[#F5F2ED] transition-all cursor-pointer"
            >
              ADD TO CALENDAR
            </button>
            <button
              type="button"
              onClick={openGoogleCalendar}
              className="px-5 py-2.5 bg-[#E50914] hover:bg-[#FF1A1A] text-white text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] cursor-pointer"
            >
              GOOGLE CALENDAR →
            </button>
          </div>
        </div>

        {/* Operational Timeline */}
        <div className="relative border-l border-[#292929] ml-3 sm:ml-6 md:ml-8 space-y-10 sm:space-y-12">
          {TIMELINE.map((slot, index) => {
            const isNow = activeSlotIdx === index;

            return (
              <div
                key={slot.start}
                className={`relative pl-8 sm:pl-12 group transition-all duration-300 ${
                  isNow ? "opacity-100" : "opacity-90 hover:opacity-100"
                }`}
              >
                {/* Node dot on timeline line */}
                <div
                  className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border transition-all ${
                    isNow
                      ? "bg-[#E50914] border-white scale-125 shadow-[0_0_12px_#E50914]"
                      : slot.isPhase
                      ? "bg-[#E50914] border-[#E50914]"
                      : "bg-[#080808] border-[#A3A3A3] group-hover:border-[#E50914]"
                  }`}
                />

                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-2">
                  {/* Timestamp range */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono text-sm sm:text-base tracking-widest font-semibold ${
                        isNow || slot.isPhase ? "text-[#E50914]" : "text-[#A3A3A3]"
                      }`}
                    >
                      {slot.start} – {slot.end}
                    </span>

                    {/* LIVE NOW badge on event day */}
                    {isNow && (
                      <span className="px-2 py-0.5 rounded-sm bg-[#E50914] text-white font-mono text-[9px] font-bold tracking-widest uppercase animate-pulse">
                        NOW
                      </span>
                    )}
                  </div>

                  {/* Slot Title */}
                  <h3
                    className={`font-heist text-xl sm:text-2xl tracking-wide uppercase ${
                      slot.isPhase
                        ? "text-white"
                        : "text-[#F5F2ED] group-hover:text-white"
                    }`}
                  >
                    {slot.title}
                  </h3>
                </div>

                {/* Slot Description */}
                <p className="text-xs sm:text-sm text-[#A3A3A3] font-light max-w-3xl leading-relaxed">
                  {slot.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default TheSchedule;
