import React, { useState, useEffect, useRef } from "react";
import hangingMoneyImg from "../../assets/images/hanging_money_vignette.png";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

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
  const [visibleIndices, setVisibleIndices] = useState(new Set());
  const [sectionEntered, setSectionEntered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const itemRefs = useRef([]);

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

  // IntersectionObserver for staggered operational reveals
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // Observe whole section to trigger money entrance
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSectionEntered(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    sectionObserver.observe(sectionEl);

    // Observe each schedule event item
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setVisibleIndices((prev) => {
              const updated = new Set(prev);
              updated.add(idx);
              return updated;
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px" }
    );

    itemRefs.current.forEach((el) => {
      if (el) itemObserver.observe(el);
    });

    // Subtle scroll listener for parallax line and money descent
    const handleScroll = () => {
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDist = rect.height + windowHeight;
        const currentDist = windowHeight - rect.top;
        const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      sectionObserver.disconnect();
      itemObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Compute how far down the timeline active line has filled (percentage based on highest visible index)
  const maxVisible = Math.max(-1, ...Array.from(visibleIndices));
  const timelineFillPct =
    maxVisible >= 0 ? Math.min(100, Math.round(((maxVisible + 0.6) / TIMELINE.length) * 100)) : 0;

  // Very subtle parallax vertical descent (max 18px)
  const moneyYOffset = Math.round(scrollProgress * 22);

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929]/80 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#E50914]/[0.035] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3 flex items-center gap-1.5">
              <AnimatedCounter value={9} padDigits={2} />
              <span>OCTOBER ·</span>
              <AnimatedCounter value={10} />
              <span>HOURS</span>
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
              className="px-5 py-2.5 bg-[#171717] hover:bg-[#222222] border border-[#292929] hover:border-[#E50914]/60 text-xs font-mono tracking-widest uppercase text-[#F5F2ED] transition-all cursor-pointer shadow-sm active:translate-y-px"
            >
              ADD TO CALENDAR
            </button>
            <button
              type="button"
              onClick={openGoogleCalendar}
              className="px-5 py-2.5 bg-[#E50914] hover:bg-[#FF1A1A] text-white text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] cursor-pointer active:translate-y-px"
            >
              GOOGLE CALENDAR →
            </button>
          </div>
        </div>

        {/* Mobile Hanging Money Banner (< lg viewports) */}
        <div className="lg:hidden relative w-full mb-12 flex justify-center items-center py-4 overflow-visible">
          {/* Thread coming from top */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[1.5px] h-14 bg-gradient-to-b from-transparent via-[#E50914]/80 to-[#E50914] pointer-events-none" />

          {/* Money bundle container with gentle sway */}
          <div
            className="relative w-44 sm:w-52 h-64 sm:h-72 pointer-events-none select-none animate-hanging-sway"
            style={{
              transition: "opacity 1.2s ease-out, transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
              opacity: sectionEntered ? 1 : 0,
            }}
          >
            {/* Ambient red halo */}
            <div className="absolute inset-0 bg-radial from-[#E50914]/20 via-[#E50914]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            <img
              src={hangingMoneyImg}
              alt="Suspended Heist Loot"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(229,9,20,0.35)]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Desktop 2-Column Grid: Timeline (Left) + Hanging Money (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* LEFT COLUMN: Operational Timeline (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div
              ref={timelineRef}
              className="relative border-l border-[#292929] ml-3 sm:ml-6 md:ml-8 space-y-12 sm:space-y-14"
            >
              {/* Dynamic Animated Red Progress Line */}
              <div
                className="absolute left-[-1px] top-0 w-[2px] bg-gradient-to-b from-[#E50914] via-[#E50914] to-[#FF1A1A] transition-all duration-700 ease-out pointer-events-none"
                style={{
                  height: `${timelineFillPct}%`,
                  boxShadow: "0 0 8px rgba(229, 9, 20, 0.7)",
                }}
              />

              {TIMELINE.map((slot, index) => {
                const isNow = activeSlotIdx === index;
                const isVisible = visibleIndices.has(index);
                const isPastOrActive = maxVisible >= index;

                return (
                  <div
                    key={slot.start}
                    ref={(el) => (itemRefs.current[index] = el)}
                    data-index={index}
                    className={`relative pl-8 sm:pl-12 group transition-all duration-500 ${
                      isVisible
                        ? "opacity-100"
                        : "opacity-40"
                    }`}
                  >
                    {/* Node dot on timeline line */}
                    <div
                      className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border transition-all duration-500 ${
                        isNow
                          ? "bg-[#E50914] border-white scale-125 shadow-[0_0_14px_#E50914]"
                          : isPastOrActive
                          ? "bg-[#E50914] border-[#FF4D4D] shadow-[0_0_8px_rgba(229,9,20,0.6)]"
                          : slot.isPhase
                          ? "bg-[#1f1f1f] border-[#E50914]"
                          : "bg-[#080808] border-[#555555] group-hover:border-[#E50914]"
                      }`}
                    />

                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-2">
                      {/* Timestamp range: fades and slides in first */}
                      <div
                        className={`flex items-center gap-3 shrink-0 transition-all duration-500 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-3"
                        }`}
                        style={{
                          transitionDelay: `${Math.min(index * 40, 200)}ms`,
                        }}
                      >
                        <span
                          className={`font-mono text-sm sm:text-base tracking-widest font-semibold transition-colors duration-300 ${
                            isNow || (isPastOrActive && slot.isPhase)
                              ? "text-[#E50914]"
                              : isPastOrActive
                              ? "text-[#F5F2ED]"
                              : "text-[#888888]"
                          }`}
                        >
                          {slot.start} – {slot.end}
                        </span>

                        {/* LIVE NOW badge on event day */}
                        {isNow && (
                          <span className="px-2 py-0.5 rounded-sm bg-[#E50914] text-white font-mono text-[9px] font-bold tracking-widest uppercase animate-pulse shadow-[0_0_10px_#E50914]">
                            NOW
                          </span>
                        )}
                      </div>

                      {/* Slot Title: reveals shortly after */}
                      <h3
                        className={`font-heist text-xl sm:text-2xl tracking-wide uppercase transition-all duration-600 ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        } ${
                          slot.isPhase
                            ? "text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]"
                            : "text-[#F5F2ED] group-hover:text-white"
                        }`}
                        style={{
                          transitionDelay: `${Math.min(index * 40 + 60, 260)}ms`,
                        }}
                      >
                        {slot.title}
                      </h3>
                    </div>

                    {/* Slot Description: reveals last */}
                    <p
                      className={`text-xs sm:text-sm text-[#A3A3A3] font-light max-w-xl leading-relaxed transition-all duration-700 ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                      style={{
                        transitionDelay: `${Math.min(index * 40 + 120, 320)}ms`,
                      }}
                    >
                      {slot.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Cinematic Hanging Money Visual (5 cols) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col items-center justify-start sticky top-24 xl:top-28 pointer-events-none select-none">
            {/* The continuous hanging thread extending from above the section */}
            <div
              className="absolute -top-36 xl:-top-44 left-1/2 -translate-x-1/2 w-[1.5px] h-36 xl:h-44 bg-gradient-to-b from-transparent via-[#E50914]/70 to-[#E50914] animate-thread-glow pointer-events-none"
              style={{
                boxShadow: "0 0 6px rgba(229, 9, 20, 0.6)",
              }}
            />

            {/* Suspended Money Prop Container with subtle sway & scroll descent */}
            <div
              className="relative w-full max-w-[340px] xl:max-w-[380px] h-[520px] xl:h-[580px] flex items-center justify-center animate-hanging-sway"
              style={{
                transform: `translate3d(0, ${moneyYOffset}px, 0)`,
                transition: "opacity 1.4s ease-out, transform 0.3s ease-out",
                opacity: sectionEntered ? 1 : 0,
              }}
            >
              {/* Deep Red Atmospheric Glow behind the Money */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 55%, rgba(229, 9, 20, 0.16) 0%, rgba(229, 9, 20, 0.05) 45%, transparent 75%)",
                  filter: "blur(30px)",
                }}
              />

              {/* The Hanging Money Image (Feathered edges, organic blend, no border) */}
              <img
                src={hangingMoneyImg}
                alt="Hanging Money Bundle"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(229,9,20,0.3)]"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TheSchedule;

