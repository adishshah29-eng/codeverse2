// Registration status & countdown logic for CodeVerse 2.0

export function getRegistrationStatus() {
  const now = new Date();
  const regOpen = new Date("2026-09-29T00:00:00");
  const regClose = new Date("2026-10-06T23:59:59");
  const eventDayStart = new Date("2026-10-09T08:00:00");
  const eventDayEnd = new Date("2026-10-09T18:00:00");

  const formatCountdown = (diffMs) => {
    if (diffMs <= 0) return "00:00:00";
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // State 1: Before 29 September
  if (now < regOpen) {
    const diff = regOpen - now;
    return {
      state: "UPCOMING",
      statusText: `REGISTRATION OPENS 29 SEP · IN ${formatCountdown(diff)}`,
      badge: "OPENS SOON",
      buttonText: "OPENS 29 SEP",
      buttonDisabled: true,
      canRegister: false,
    };
  }

  // State 2: 29 September – 6 October (Registration Open)
  if (now >= regOpen && now <= regClose) {
    const diff = regClose - now;
    return {
      state: "OPEN",
      statusText: `REGISTRATION OPEN · CLOSES IN ${formatCountdown(diff)}`,
      badge: "LIVE NOW",
      buttonText: "JOIN THE CREW ON UNSTOP →",
      buttonDisabled: false,
      canRegister: true,
      unstopUrl: "https://unstop.com",
    };
  }

  // State 3: 7 October – Event Day morning
  if (now > regClose && now < eventDayStart) {
    return {
      state: "CLOSED",
      statusText: "REGISTRATION CLOSED · SEE YOU ON 9 OCT",
      badge: "DOORS SHUT",
      buttonText: "REGISTRATION CLOSED",
      buttonDisabled: true,
      canRegister: false,
    };
  }

  // State 4: Event Day (9 Oct 08:00 – 18:00)
  if (now >= eventDayStart && now <= eventDayEnd) {
    return {
      state: "EVENT_DAY",
      statusText: "LIVE NOW · DWARKADAS J. SANGHVI COLLEGE OF ENGINEERING",
      badge: "HEIST IN PROGRESS",
      buttonText: "LIVE · INSIDE THE MINT",
      buttonDisabled: true,
      canRegister: false,
    };
  }

  // State 5: After Event
  return {
    state: "ENDED",
    statusText: "THE HEIST IS OVER · THANKS FOR PLAYING",
    badge: "MISSION COMPLETE",
    buttonText: "THE HEIST IS OVER",
    buttonDisabled: true,
    canRegister: false,
  };
}
