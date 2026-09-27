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

function App() {
  return (
    <main className="w-full bg-[#080808] text-[#F5F2ED] selection:bg-[#E50914] selection:text-white">
      {/* Global Background Audio Controller - Persistent in left corner */}
      <GlobalBackgroundAudio />

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
    </main>
  );
}

export default App;