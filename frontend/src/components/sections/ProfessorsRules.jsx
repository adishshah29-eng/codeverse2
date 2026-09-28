import React, { useState, useRef } from "react";
import VariableProximity from "@/components/ui/VariableProximity";
import { BlurText, BlurFade } from "@/components/ui/BlurText";

const RULES = [
  {
    num: "01",
    title: "THREE TO A CREW.",
    desc: "Nobody goes in alone, and nobody brings a fourth.",
  },
  {
    num: "02",
    title: "FORTY-FIVE CREWS GET IN.",
    desc: "Registration runs 29 September to 6 October on Unstop.",
  },
  {
    num: "03",
    title: "NO ONE GETS HURT.",
    desc: "Original work only. No plagiarism.",
  },
  {
    num: "04",
    title: "BRING YOUR OWN TOOLS.",
    desc: "Laptop, laptop charger, college ID.",
  },
  {
    num: "05",
    title: "OPEN TO EVERYONE.",
    desc: "Any college, any branch, any level.",
  },
];

const FAQS = [
  {
    q: "How do I register?",
    a: "Registration runs on Unstop from 29 September to 6 October. Hit Join the crew, form your team of three there and you're in.",
  },
  {
    q: "How many crews can enter?",
    a: "Forty-five. Once the seats are gone, the door closes.",
  },
  {
    q: "Is there a registration fee?",
    a: "Yes. The registration fee is ₹99.",
  },
  {
    q: "Where does the heist happen?",
    a: "Dwarkadas J. Sanghvi College of Engineering, Mumbai, on 9 October.",
  },
  {
    q: "Can beginners join?",
    a: "Yes. The event is open to everyone, whatever your college, branch or experience.",
  },
];

export function ProfessorsRules() {
  const rulesHeaderRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section
      id="rules"
      className="relative w-full bg-[#080808]/75 backdrop-blur-[1px] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929]/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={rulesHeaderRef} className="mb-16 md:mb-24 relative">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
            READ BEFORE YOU ENTER · PROTOCOLS
          </p>
          <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
            <VariableProximity
              label="THE PROFESSOR'S RULES"
              className="cursor-default"
              fromFontVariationSettings="'wght' 700, 'opsz' 30"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={rulesHeaderRef}
              radius={130}
              falloff="linear"
            />
          </h2>
          <BlurText
            text="In any operation, discipline is the difference between freedom and capture."
            className="font-sans text-lg sm:text-xl text-[#A3A3A3] mt-4 font-light max-w-2xl block"
            delay={0.15}
          />
        </div>

        {/* The 5 Non-Negotiable Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {RULES.map((rule, idx) => (
            <div
              key={rule.num}
              className={`p-8 bg-[#111111] border border-[#292929] hover:border-[#E50914]/60 transition-all duration-300 flex flex-col justify-between group ${
                idx === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div>
                <span className="font-mono text-xs tracking-[0.3em] text-[#E50914] font-bold block mb-4">
                  RULE {rule.num}
                </span>
                <h3 className="font-heist text-2xl sm:text-3xl text-white tracking-wider uppercase mb-3">
                  {rule.title}
                </h3>
              </div>
              <p className="font-mono text-sm text-[#A3A3A3] tracking-wide mt-4">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto pt-12 border-t border-[#292929]">
          <div className="text-center mb-12">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#E50914] font-semibold block mb-2">
              CLARIFICATIONS
            </span>
            <h3 className="font-heist text-3xl sm:text-4xl text-white tracking-wider uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h3>
          </div>

          <div className="divide-y divide-[#292929] border-y border-[#292929]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div key={faq.q} className="group">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="font-mono text-sm sm:text-base text-[#F5F2ED] group-hover:text-[#E50914] transition-colors tracking-wide">
                      {faq.q}
                    </span>
                    <span
                      className={`font-mono text-xl text-[#E50914] transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="font-sans text-sm sm:text-base text-[#A3A3A3] font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProfessorsRules;
