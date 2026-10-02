import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import daliMaskImg from "@/assets/images/dali_mask.jpg";
import dollarBillImg from "@/assets/images/dollar_bill.png";
import scheduleIdBadge from "@/assets/images/schedule_id_badge.jpg";
import scheduleVaultWheel from "@/assets/images/schedule_vault_wheel.jpg";
import scheduleBlueprintMap from "@/assets/images/schedule_blueprint_map.jpg";
import scheduleHoodedDali from "@/assets/images/schedule_hooded_dali.jpg";
import scheduleLaptopCode from "@/assets/images/schedule_laptop_code.jpg";
import scheduleTrophy from "@/assets/images/schedule_trophy.jpg";

// Precision Heist milestones with exact scroll activation thresholds.
// Calibrated for both Desktop widescreen (1600 x 760) and Mobile vertical serpentine (380 x 920).
const HEIST_EVENTS = [
  {
    num: "01",
    time: "08:00 – 09:00",
    title: "CREW REGISTRATION WINDOW",
    desc: "Verification of crew credentials & hardware deployment at the security checkpoint.",
    img: scheduleIdBadge,
    // Desktop layout
    nodeLeft: "68.8%",
    nodeTop: "11.8%",
    cardLeft: "72%",
    cardTop: "5%",
    maxWidth: "310px",
    imgPosition: "right",
    // Mobile serpentine curve layout (380 x 920)
    mobileNodeLeft: "71%",   // (270, 70)
    mobileNodeTop: "7.6%",
    mobileCardLeft: "5%",    // (19, 35) to the left of node
    mobileCardTop: "3.8%",
    threshold: 0.05,
  },
  {
    num: "02",
    time: "09:00 – 09:30",
    title: "OPENING CEREMONY & RULES BRIEFING",
    desc: "The Professor's final broadcast. Decryption keys and challenge packets released.",
    img: daliMaskImg,
    // Desktop layout
    nodeLeft: "34.4%",
    nodeTop: "18.4%",
    cardLeft: "38%",
    cardTop: "5%",
    maxWidth: "310px",
    imgPosition: "right",
    // Mobile serpentine curve layout
    mobileNodeLeft: "23.7%", // (90, 200)
    mobileNodeTop: "21.7%",
    mobileCardLeft: "31%",   // (118, 165) to the right of node
    mobileCardTop: "17.9%",
    threshold: 0.18,
  },
  {
    num: "03",
    time: "10:00 – 13:30",
    title: "PHASE 1 · INSIDE THE MINT",
    desc: "All 45 crews enter. Rapid development and tactical problem solving. Top 10 advance.",
    img: scheduleVaultWheel,
    // Desktop layout
    nodeLeft: "5.6%",
    nodeTop: "34.2%",
    cardLeft: "9%",
    cardTop: "27%",
    maxWidth: "315px",
    imgPosition: "left",
    isWheel: true,
    // Mobile serpentine curve layout
    mobileNodeLeft: "76.3%", // (290, 330)
    mobileNodeTop: "35.9%",
    mobileCardLeft: "5%",    // (19, 295) to the left of node
    mobileCardTop: "32.1%",
    threshold: 0.35,
  },
  {
    num: "04",
    time: "13:30 – 14:30",
    title: "BREAK · RESET FOR THE NEXT PHASE",
    desc: "Recalibration, reconnaissance, and security lockdown before the escape phase begins.",
    img: scheduleBlueprintMap,
    // Desktop layout
    nodeLeft: "18.8%",
    nodeTop: "51.3%",
    cardLeft: "23%",
    cardTop: "39%",
    maxWidth: "310px",
    imgPosition: "left",
    // Mobile serpentine curve layout
    mobileNodeLeft: "21.1%", // (80, 460)
    mobileNodeTop: "50%",
    mobileCardLeft: "31%",   // (118, 425) to the right of node
    mobileCardTop: "46.2%",
    threshold: 0.50,
  },
  {
    num: "05",
    time: "14:30 – 16:30",
    title: "PHASE 2 · THE ESCAPE",
    desc: "Top 10 crews hunt and solve under pressure. First to collect every hint walks out.",
    img: scheduleHoodedDali,
    // Desktop layout
    nodeLeft: "65.6%",
    nodeTop: "57.9%",
    cardLeft: "69%",
    cardTop: "44%",
    maxWidth: "310px",
    imgPosition: "left",
    // Mobile serpentine curve layout
    mobileNodeLeft: "78.9%", // (300, 590)
    mobileNodeTop: "64.1%",
    mobileCardLeft: "5%",    // (19, 555) to the left of node
    mobileCardTop: "60.3%",
    threshold: 0.66,
  },
  {
    num: "06",
    time: "16:30 – 17:15",
    title: "FINAL SCORE EVALUATION",
    desc: "Verification of cryptographic proofs, code integrity, and hint acquisition logs.",
    img: scheduleLaptopCode,
    // Desktop layout
    nodeLeft: "28.1%",
    nodeTop: "77.6%",
    cardLeft: "48%",
    cardTop: "66%",
    maxWidth: "315px",
    imgPosition: "left",
    // Mobile serpentine curve layout
    mobileNodeLeft: "23.7%", // (90, 720)
    mobileNodeTop: "78.3%",
    mobileCardLeft: "31%",   // (118, 685) to the right of node
    mobileCardTop: "74.5%",
    threshold: 0.82,
  },
  {
    num: "07",
    time: "17:15 – 18:00",
    title: "PRIZE DISTRIBUTION",
    desc: "Vault distribution: trophies, cash loot awarded, and e-certificates released.",
    img: scheduleTrophy,
    // Desktop layout
    nodeLeft: "5%",
    nodeTop: "77.6%",
    cardLeft: "12%",
    cardTop: "66%",
    maxWidth: "310px",
    imgPosition: "left",
    isVaultEndpoint: true,
    // Mobile serpentine curve layout (Vault finish)
    mobileNodeLeft: "71%",   // (270, 850)
    mobileNodeTop: "92.4%",
    mobileCardLeft: "5%",    // (19, 815)
    mobileCardTop: "88.6%",
    threshold: 0.95,
  },
];

// Desktop widescreen Bézier curve (1600 x 760)
const DESKTOP_PATH_D = `
  M 1100 90
  C 920 140, 720 140, 550 140
  C 340 140, 140 180, 90 260
  C 50 340, 160 390, 300 390
  C 500 390, 820 410, 1050 440
  C 1240 470, 1240 540, 1050 570
  C 850 590, 620 590, 450 590
  C 320 590, 200 590, 80 590
`;

// Mobile Serpentine S-Curve (380 x 920) - Sweeps elegantly across the mobile screen!
const MOBILE_PATH_D = `
  M 270 70
  C 270 140, 90 140, 90 200
  C 90 270, 290 270, 290 330
  C 290 400, 80 400, 80 460
  C 80 530, 300 530, 300 590
  C 300 660, 90 660, 90 720
  C 90 790, 270 790, 270 850
`;

/**
 * Desktop Milestone Card Component
 */
function DesktopMilestoneCard({ event, smoothProgress }) {
  const t = event.threshold;

  const opacity = useTransform(smoothProgress, [t - 0.03, t + 0.02], [0.06, 1]);
  const scale = useTransform(smoothProgress, [t - 0.03, t + 0.02], [0.92, 1]);
  const translateY = useTransform(smoothProgress, [t - 0.03, t + 0.02], [8, 0]);

  const nodeGlow = useTransform(smoothProgress, [t - 0.02, t + 0.02], [0, 1]);
  const nodeScale = useTransform(smoothProgress, [t - 0.02, t + 0.02], [0.85, 1.15]);

  return (
    <>
      {/* Node Dot / Vault Ring */}
      <div
        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: event.nodeLeft, top: event.nodeTop }}
      >
        {event.isVaultEndpoint ? (
          <motion.div
            style={{ scale: nodeScale }}
            className="relative w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-black border-2 border-[#E50914] flex items-center justify-center shadow-[0_0_20px_#E50914]"
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-[#E50914]/70 animate-[spin_8s_linear_infinite]" />
            <motion.div
              style={{ opacity: nodeGlow }}
              className="w-3.5 h-3.5 rounded-full bg-[#E50914] shadow-[0_0_12px_#E50914]"
            />
          </motion.div>
        ) : (
          <motion.div style={{ scale: nodeScale }} className="relative flex items-center justify-center">
            <motion.div
              style={{ opacity: nodeGlow }}
              className="absolute w-7 h-7 rounded-full bg-[#E50914]/30 border border-[#E50914]/70 shadow-[0_0_12px_#E50914] animate-ping"
            />
            <div className="w-4 h-4 rounded-full bg-black border-2 border-[#E50914] flex items-center justify-center shadow-[0_0_8px_#E50914]">
              <motion.div
                style={{ opacity: nodeGlow }}
                className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_8px_#E50914]"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* HTML Milestone Card */}
      <motion.div
        style={{
          left: event.cardLeft,
          top: event.cardTop,
          maxWidth: event.maxWidth,
          opacity,
          scale,
          y: translateY,
        }}
        className="absolute z-30 pointer-events-auto"
      >
        <div className="flex items-start gap-2.5 px-3 py-2 rounded-sm bg-[#0e0e0e]/95 backdrop-blur-md border border-[#2b2b2b] hover:border-[#E50914]/50 transition-colors shadow-[0_6px_24px_rgba(0,0,0,0.85)]">
          {event.imgPosition === "left" && event.img && (
            <div
              className={`shrink-0 overflow-hidden border border-[#333] bg-[#111] shadow-md ${
                event.isWheel ? "w-11 h-11 rounded-full border-[#E50914]/50" : "w-10 h-10 rounded-sm"
              }`}
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-full object-cover filter contrast-115 brightness-95"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 leading-none mb-1">
              <span className="font-mono text-xs font-bold tracking-wider text-[#E50914] drop-shadow-[0_0_6px_rgba(229,9,20,0.4)]">
                {event.num}
              </span>
              <span className="font-mono text-xs font-semibold tracking-wider text-[#FF5555]">
                {event.time}
              </span>
            </div>

            <h3 className="font-heist text-xs lg:text-[13px] text-white tracking-wide uppercase font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {event.title}
            </h3>

            <p className="font-sans text-[10.5px] text-[#A8A8A8] font-light leading-relaxed mt-0.5 line-clamp-2">
              {event.desc}
            </p>
          </div>

          {event.imgPosition === "right" && event.img && (
            <div className="w-10 h-10 shrink-0 rounded-sm overflow-hidden border border-[#333] bg-[#111] shadow-md">
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-full object-cover filter contrast-115 brightness-95"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

/**
 * Mobile Milestone Card Component:
 * Perfectly placed along the Mobile Serpentine S-Curve with matching scroll-driven reveals.
 */
function MobileMilestoneCard({ event, smoothProgress }) {
  const t = event.threshold;

  const opacity = useTransform(smoothProgress, [t - 0.03, t + 0.02], [0.08, 1]);
  const scale = useTransform(smoothProgress, [t - 0.03, t + 0.02], [0.92, 1]);
  const translateY = useTransform(smoothProgress, [t - 0.03, t + 0.02], [6, 0]);

  const nodeGlow = useTransform(smoothProgress, [t - 0.02, t + 0.02], [0, 1]);
  const nodeScale = useTransform(smoothProgress, [t - 0.02, t + 0.02], [0.85, 1.15]);

  return (
    <>
      {/* Node Dot / Vault Ring on mobile S-curve */}
      <div
        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: event.mobileNodeLeft, top: event.mobileNodeTop }}
      >
        {event.isVaultEndpoint ? (
          <motion.div
            style={{ scale: nodeScale }}
            className="relative w-9 h-9 rounded-full bg-black border-2 border-[#E50914] flex items-center justify-center shadow-[0_0_15px_#E50914]"
          >
            <div className="absolute inset-0.5 rounded-full border border-dashed border-[#E50914]/70 animate-[spin_8s_linear_infinite]" />
            <motion.div
              style={{ opacity: nodeGlow }}
              className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914]"
            />
          </motion.div>
        ) : (
          <motion.div style={{ scale: nodeScale }} className="relative flex items-center justify-center">
            <motion.div
              style={{ opacity: nodeGlow }}
              className="absolute w-6 h-6 rounded-full bg-[#E50914]/30 border border-[#E50914]/70 shadow-[0_0_10px_#E50914] animate-ping"
            />
            <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-[#E50914] flex items-center justify-center shadow-[0_0_8px_#E50914]">
              <motion.div
                style={{ opacity: nodeGlow }}
                className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff,0_0_8px_#E50914]"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* HTML Card on Mobile - Placed on the open side of the curve */}
      <motion.div
        style={{
          left: event.mobileCardLeft,
          top: event.mobileCardTop,
          maxWidth: "245px",
          opacity,
          scale,
          y: translateY,
        }}
        className="absolute z-30 pointer-events-auto"
      >
        <div className="flex items-start gap-2 p-2 rounded-sm bg-[#0e0e0e]/95 backdrop-blur-md border border-[#2b2b2b] hover:border-[#E50914]/50 transition-colors shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          {event.img && (
            <div
              className={`shrink-0 overflow-hidden border border-[#333] bg-[#111] shadow-md ${
                event.isWheel ? "w-9 h-9 rounded-full border-[#E50914]/50" : "w-8 h-8 rounded-sm"
              }`}
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-full object-cover filter contrast-115 brightness-95"
                loading="lazy"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5 leading-none">
              <span className="font-mono text-[10px] font-bold text-[#E50914]">{event.num}</span>
              <span className="font-mono text-[10px] font-semibold text-[#FF4D4D]">{event.time}</span>
            </div>
            <h4 className="font-heist text-[11px] text-white uppercase tracking-wider font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-2">
              {event.title}
            </h4>
            <p className="font-sans text-[9.5px] text-[#A8A8A8] font-light leading-relaxed mt-0.5 line-clamp-2">
              {event.desc}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function TheSchedule() {
  const containerRef = useRef(null);

  // Scroll tracking across the Schedule section (smooth 0 to 1 during section traverse)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 50%"],
  });

  // Spring physics for responsive, buttery-smooth scroll wheel tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    mass: 0.45,
    restDelta: 0.0002,
  });

  // Path length: laser progressively draws directly with scroll (0 to 1)
  const pathLength = useTransform(smoothProgress, [0.03, 0.95], [0, 1]);

  return (
    <section
      id="schedule"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] border-t border-[#292929]/80 py-6 sm:py-10 px-2 sm:px-6 overflow-hidden select-none flex flex-col justify-between items-center"
    >
      {/* Background Subtle Red Military Grid Pattern (identical to TheMint and other pages) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(229, 9, 20, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 9, 20, 0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient Crimson Vignettes (identical to ThePlan and TheLoot) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-[#E50914]/[0.035] rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Dalí Silhouette Watermark in bottom corner */}
      <div
        className="absolute bottom-2 right-2 w-72 h-72 lg:w-96 lg:h-96 opacity-[0.06] pointer-events-none bg-contain bg-no-repeat bg-right-bottom filter contrast-150"
        style={{ backgroundImage: `url(${daliMaskImg})` }}
      />

      {/* ================= SECTION HEADER ================= */}
      <div className="text-center shrink-0 z-20 pt-1 pb-2">
        <span className="font-mono text-xs sm:text-sm text-[#E50914] tracking-widest uppercase block mb-1 font-semibold">
          09 OCTOBER · 10 HOURS
        </span>
        <h2 className="font-heist text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wider uppercase leading-none mb-1">
          THE SCHEDULE
        </h2>
        <p className="font-mono text-xs sm:text-sm text-[#888888] tracking-wide">
          Crews of 2–3. Be through the door on time.
        </p>
      </div>

      {/* ================= DESKTOP & TABLET: SCROLL-DRIVEN HEIST ROUTE ================= */}
      <div
        className="hidden md:block relative w-full max-w-[1450px] my-auto"
        style={{ aspectRatio: "1600 / 760" }}
      >
        {/* Floating Banknotes along the route */}
        <motion.img
          src={dollarBillImg}
          alt="100 Dollar Bill"
          className="absolute z-15 w-24 lg:w-28 opacity-65 pointer-events-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          style={{
            left: "40%",
            top: "14%",
            transform: "rotate(-12deg)",
          }}
          animate={{
            y: [-3, 4, -3],
            rotate: [-12, -9, -12],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        />

        <motion.img
          src={dollarBillImg}
          alt="100 Dollar Bill"
          className="absolute z-15 w-20 lg:w-24 opacity-55 pointer-events-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          style={{
            left: "58%",
            top: "65%",
            transform: "rotate(15deg)",
          }}
          animate={{
            y: [4, -4, 4],
            rotate: [15, 11, 15],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />

        {/* SVG LASER ROUTE CANVAS */}
        <svg
          viewBox="0 0 1600 760"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="heistLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="13" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Always-visible tactical route blueprint guide */}
          <path
            d={DESKTOP_PATH_D}
            fill="none"
            stroke="#E50914"
            strokeWidth="2"
            strokeOpacity="0.22"
            strokeDasharray="6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing diffuse red laser */}
          <motion.path
            d={DESKTOP_PATH_D}
            fill="none"
            stroke="#E50914"
            strokeWidth="11"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#heistLaserGlow)"
            style={{ pathLength }}
          />

          {/* Focused sharp red laser line */}
          <motion.path
            d={DESKTOP_PATH_D}
            fill="none"
            stroke="#E50914"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* Intense white-hot filament center */}
          <motion.path
            d={DESKTOP_PATH_D}
            fill="none"
            stroke="#FFF0F0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />
        </svg>

        {/* Desktop HTML MILESTONES */}
        {HEIST_EVENTS.map((event) => (
          <DesktopMilestoneCard
            key={`desktop-step-${event.num}`}
            event={event}
            smoothProgress={smoothProgress}
          />
        ))}
      </div>

      {/* ================= MOBILE: SAME TO SAME SERPENTINE S-CURVE ROUTE ================= */}
      <div
        className="block md:hidden relative max-w-[390px] w-full mx-auto my-auto"
        style={{ aspectRatio: "380 / 920" }}
      >
        {/* Floating Mini Banknote on Mobile Route */}
        <motion.img
          src={dollarBillImg}
          alt="100 Dollar Bill"
          className="absolute z-15 w-16 opacity-60 pointer-events-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
          style={{
            left: "48%",
            top: "52%",
            transform: "rotate(14deg)",
          }}
          animate={{
            y: [-3, 3, -3],
            rotate: [14, 10, 14],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        />

        {/* Mobile SVG Serpentine S-Curve Laser */}
        <svg
          viewBox="0 0 380 920"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="mobileLaserGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Blueprint dashed guide track */}
          <path
            d={MOBILE_PATH_D}
            fill="none"
            stroke="#E50914"
            strokeWidth="2"
            strokeOpacity="0.22"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing diffuse laser beam */}
          <motion.path
            d={MOBILE_PATH_D}
            fill="none"
            stroke="#E50914"
            strokeWidth="8"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#mobileLaserGlow)"
            style={{ pathLength }}
          />

          {/* Sharp red laser line */}
          <motion.path
            d={MOBILE_PATH_D}
            fill="none"
            stroke="#E50914"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />

          {/* White-hot filament center */}
          <motion.path
            d={MOBILE_PATH_D}
            fill="none"
            stroke="#FFF0F0"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength }}
          />
        </svg>

        {/* Mobile HTML Milestones along the Serpentine S-Curve */}
        {HEIST_EVENTS.map((event) => (
          <MobileMilestoneCard
            key={`mobile-step-${event.num}`}
            event={event}
            smoothProgress={smoothProgress}
          />
        ))}
      </div>
    </section>
  );
}

export default TheSchedule;
