import React from "react";

export function TheLoot() {
  const PRIZES = [
    {
      rank: "01",
      title: "1ST CREW OUT",
      amount: "₹12,000",
      perk: "+ THE WINNER’S TROPHY",
      status: "PRIMARY TARGET",
      accent: "#C9A227", // Gold Brass highlight
      isFirst: true,
    },
    {
      rank: "02",
      title: "2ND CREW OUT",
      amount: "₹8,000",
      perk: "+ RUNNER-UP TROPHY",
      status: "SECONDARY TARGET",
      accent: "#E50914",
      isFirst: false,
    },
    {
      rank: "03",
      title: "3RD CREW OUT",
      amount: "₹5,000",
      perk: "+ THIRD PLACE TROPHY",
      status: "TERTIARY TARGET",
      accent: "#A3A3A3",
      isFirst: false,
    },
  ];

  return (
    <section
      id="loot"
      className="relative w-full bg-[#080808] text-[#F5F2ED] py-28 md:py-36 px-6 lg:px-16 border-t border-[#292929] overflow-hidden"
    >
      {/* Ambient vault glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div>
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#E50914] font-semibold mb-3">
              INVENTORY · VAULT RESERVE
            </p>
            <h2 className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5F2ED] uppercase">
              THE LOOT
            </h2>
          </div>

          {/* Total Prize Pool Callout */}
          <div className="p-6 bg-[#111111] border border-[#292929] max-w-sm">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#A3A3A3] uppercase block mb-1">
              TOTAL PRINTED RESERVE
            </span>
            <span className="font-heist text-3xl sm:text-4xl text-[#C9A227] tracking-wider block drop-shadow-[0_0_20px_rgba(201,162,39,0.3)]">
              ₹25,000
            </span>
          </div>
        </div>

        {/* Editorial Vault Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {PRIZES.map((item) => (
            <div
              key={item.rank}
              className={`relative p-8 sm:p-10 bg-[#111111] border transition-all duration-500 flex flex-col justify-between group ${
                item.isFirst
                  ? "border-[#C9A227]/60 hover:border-[#C9A227] shadow-[0_0_30px_rgba(201,162,39,0.1)]"
                  : "border-[#292929] hover:border-[#E50914]/60"
              }`}
            >
              {/* Corner metadata */}
              <div>
                <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#292929]">
                  <span
                    className="font-mono text-xs tracking-[0.3em] font-bold uppercase"
                    style={{ color: item.accent }}
                  >
                    LOCKER {item.rank}
                  </span>
                  <span className="font-mono text-[10px] text-[#666666] tracking-widest uppercase">
                    {item.status}
                  </span>
                </div>

                <h3 className="font-heist text-lg sm:text-xl text-[#A3A3A3] tracking-widest uppercase mb-4">
                  {item.title}
                </h3>

                {/* Oversized Cash Prize */}
                <div
                  className="font-heist text-5xl sm:text-6xl tracking-tight text-white mb-4"
                  style={{ color: item.isFirst ? "#F5F2ED" : undefined }}
                >
                  {item.amount}
                </div>
              </div>

              {/* Perk label */}
              <div className="pt-6 border-t border-[#292929]">
                <p
                  className="font-mono text-xs tracking-[0.2em] uppercase font-bold"
                  style={{ color: item.accent }}
                >
                  {item.perk}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Participant Certificate Guarantee Banner */}
        <div className="p-6 sm:p-8 bg-[#171717]/80 border border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-[#E50914] shrink-0" />
            <div>
              <p className="font-heist text-lg sm:text-xl text-white tracking-wider uppercase">
                EVERY PARTICIPANT RECEIVES AN E-CERTIFICATE
              </p>
              <p className="font-mono text-xs text-[#A3A3A3] tracking-wide mt-1">
                Issued with verified cryptographic proof of deployment in the Royal Mint.
              </p>
            </div>
          </div>

          <span className="font-mono text-[11px] text-[#C9A227] tracking-[0.2em] uppercase px-4 py-2 border border-[#C9A227]/30 bg-[#C9A227]/5 shrink-0">
            OFFICIAL ACCREDITATION
          </span>
        </div>

      </div>
    </section>
  );
}

export default TheLoot;
