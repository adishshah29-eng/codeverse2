import React, { useRef } from "react";
import VariableProximity from "@/components/ui/VariableProximity";
import { BlurText, BlurFade } from "@/components/ui/BlurText";
import unstopLogo from "@/assets/images/unstop_logo.png";

const CHALLENGES = [
  "Cryptographic clues",
  "Debugging systems",
  "Hidden information",
  "Digital trails",
  "Data & machine learning",
  "Algorithmic challenges",
  "Strategic trade-offs",
];

function FileCard({ file, label, title, children, className = "" }) {
  return (
    <div
      className={`relative p-8 bg-[#111111] border border-[#292929] hover:border-[#E50914]/60 transition-all duration-300 ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914]/70 to-transparent" />
      <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-5">
        <span className="text-[#E50914] font-bold">FILE {file}</span>
        <span className="text-[#666666]">{label}</span>
      </div>
      <h3 className="font-heist text-2xl sm:text-3xl text-white tracking-wider uppercase mb-4">
        {title}
      </h3>
      <div className="font-mono text-sm leading-relaxed text-[#A3A3A3] tracking-wide space-y-4">
        {children}
      </div>
    </div>
  );
}

export function TheAbout() {
  const headerRef = useRef(null);

  return (
    <section
      id="about"
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] py-24 md:py-32 px-6 lg:px-16 border-t border-[#292929]/80 overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-14 md:mb-20">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            CASE FILES · THE ORGANISATION
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            <VariableProximity
              label="ABOUT THE HEIST"
              className="cursor-default"
              fromFontVariationSettings="'wght' 700, 'opsz' 30"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={headerRef}
              radius={130}
              falloff="linear"
            />
          </h2>
          <BlurText
            text="One Plan. One Code. One Heist."
            className="font-sans text-lg sm:text-xl text-[#A3A3A3] mt-4 font-light max-w-2xl block"
            delay={0.15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileCard
            file="01"
            label="THE EVENT"
            title="About CodeVerse 2.0"
            className="lg:col-span-2"
          >
            <p>
              CodeVerse 2.0 is a high-intensity, technology-driven heist
              experience where coding, strategy, investigation and
              decision-making collide. Hosted by DJS Code AI in collaboration
              with Unstop, it challenges teams to think beyond conventional
              problem-solving and work together under pressure.
            </p>
            <p>
              Across multiple stages, you will crack cryptographic clues, debug
              systems, uncover hidden information, investigate digital trails,
              work with data and machine learning, solve algorithmic challenges
              and navigate strategic trade-offs. Every challenge feeds the final
              extraction, where your team&apos;s decisions, resources and
              performance come together.
            </p>
            <p className="text-[#F5F2ED]">
              It isn&apos;t just about solving problems. It&apos;s about
              thinking fast, adapting faster, and turning technical skills into
              a successful heist.
            </p>
            <ul className="flex flex-wrap gap-2 pt-2" aria-label="Challenge types">
              {CHALLENGES.map((c) => (
                <li
                  key={c}
                  className="px-3 py-1.5 border border-[#292929] bg-[#0b0b0b] text-[11px] tracking-[0.15em] uppercase text-[#F5F2ED]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </FileCard>

          <FileCard file="02" label="THE HOST" title="About DJS Code AI">
            <p>
              DJS Code AI is the official AI &amp; ML Club of Dwarkadas J.
              Sanghvi College of Engineering, Mumbai, built around one idea:
              learn by building, and build to create real impact.
            </p>
            <p>
              The club runs hands-on bootcamps, technical events, hackathons,
              workshops and mentorship programs. Members work on real-world
              projects, explore emerging technologies and collaborate across
              disciplines, and the club also takes on outsourced technology
              projects for clients, giving students exposure to practical
              development and professional workflows.
            </p>
            <p>
              From learning the fundamentals to shipping ambitious projects, it
              is a community where curiosity becomes capability.
            </p>
          </FileCard>

          <FileCard file="03" label="THE VENUE" title="About DJSCE">
            <p>
              SVKM&apos;s Dwarkadas J. Sanghvi College of Engineering (DJSCE),
              established in 1994, is an autonomous engineering institution known
              for academic excellence, innovation and industry exposure.
            </p>
            <p>
              It offers undergraduate, postgraduate and Ph.D. programmes with
              experienced faculty, modern laboratories and advanced learning
              facilities. Its eligible undergraduate programmes are accredited by
              the NBA, and the institute holds an &lsquo;A&rsquo; grade from
              NAAC.
            </p>
            <p>
              A vibrant student community runs through clubs such as IEEE, ACM,
              DJS UNICODE, DJS DJINIT.AI, DJS COMPUTE, DJS BEATS, DJS E-CELL and
              DJS CODEAI, building technical, creative, entrepreneurial and
              leadership skills.
            </p>
          </FileCard>
        </div>

        <BlurFade delay={0.2} className="mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-5 py-6 px-6 border border-[#292929] bg-[#0b0b0b]/80 font-mono text-[11px] tracking-[0.25em] uppercase text-[#666666]">
            <span>
              Hosted by <span className="text-white font-bold">DJS Code AI</span>
            </span>
            <span className="flex items-center gap-3">
              Powered by
              <img src={unstopLogo} alt="Unstop" className="h-6 w-auto" />
            </span>
            <span>
              With{" "}
              <span className="text-white font-bold">
                Institution&apos;s Innovation Council, DJSCE
              </span>
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export default TheAbout;
