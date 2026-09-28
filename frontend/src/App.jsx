import React from "react";
import CinematicIntro from "@/components/cinematic/CinematicIntro";
import TheBriefing from "@/components/sections/TheBriefing";
import ThePlan from "@/components/sections/ThePlan";
import TheSchedule from "@/components/sections/TheSchedule";
import TheLoot from "@/components/sections/TheLoot";
import CrewIdGenerator from "@/components/sections/CrewIdGenerator";
import ProfessorsRules from "@/components/sections/ProfessorsRules";
import TheMint from "@/components/sections/TheMint";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import GlobalBackgroundAudio from "@/components/cinematic/GlobalBackgroundAudio";
import heistBg from "@/assets/images/heist_bg.png";

function App() {
  return (
    <main className="relative w-full min-h-screen text-[#F5F2ED] selection:bg-[#E50914] selection:text-white">
      {/* Global Fixed Heist Board Background - Unobstructed scrolling & non-interactive layer */}
      <div
        className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={heistBg}
          alt=""
          className="w-full h-full object-cover object-center scale-[1.01] opacity-90"
        />
        {/* Subtle dark tint to preserve contrast and legibility */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      </div>

      {/* Global Background Audio Controller - Persistent in left corner */}
      <div className="relative z-50">
        <GlobalBackgroundAudio />
      </div>

      {/* Website Sections & Chapters */}
      <div className="relative z-10 w-full">
        {/* Existing Landing Page - Preserved */}
        <CinematicIntro />

        {/* Chapters 01 through 09 - The Heist Website */}
        <TheBriefing />
        <ThePlan />
        <TheSchedule />
        <TheLoot />
        <CrewIdGenerator />
        <ProfessorsRules />
        <TheMint />
        <FinalCta />
        <Footer />
      </div>
    </main>
  );
}

export default App;