import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "heist_bgm_enabled";
const AUDIO_SRC = "/sound/background_sound.mpeg";
const TARGET_VOLUME = 0.38;

/**
 * GlobalBackgroundAudio
 * 
 * Persistent background audio controller in the left corner:
 * - Plays `/sound/background_sound.mpeg` in a continuous loop throughout the site
 * - Gracefully handles browser autoplay policies via auto-unlock on first user interaction
 * - Tactical HUD styling with live animated audio equalizer bars
 * - Saves user sound preference to localStorage
 */
export function GlobalBackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Smooth volume fader
  const fadeIn = useCallback((audio) => {
    if (!audio) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.volume = 0;
    let currentVol = 0;
    fadeIntervalRef.current = setInterval(() => {
      currentVol = Math.min(TARGET_VOLUME, currentVol + 0.04);
      if (audio) audio.volume = currentVol;
      if (currentVol >= TARGET_VOLUME) {
        clearInterval(fadeIntervalRef.current);
      }
    }, 60);
  }, []);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          fadeIn(audio);
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was prevented by browser policy; wait for first user interaction
          setIsPlaying(false);
        });
    }
  }, [fadeIn]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    audio.pause();
    setIsPlaying(false);
  }, []);

  // Handle initial play and user interaction unlock listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = TARGET_VOLUME;

    // Check saved preference
    let preferredState = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        preferredState = JSON.parse(saved);
      }
    } catch {
      preferredState = true;
    }

    if (preferredState) {
      // Attempt autoplay
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            fadeIn(audio);
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy: attach one-time unlock listener
            const unlockHandler = () => {
              // Only play if still preferred
              try {
                const s = localStorage.getItem(STORAGE_KEY);
                if (s !== null && !JSON.parse(s)) return;
              } catch {}
              
              audio.play().then(() => {
                fadeIn(audio);
                setIsPlaying(true);
              }).catch(() => {});

              cleanupListeners();
            };

            const cleanupListeners = () => {
              window.removeEventListener("click", unlockHandler);
              window.removeEventListener("keydown", unlockHandler);
              window.removeEventListener("touchstart", unlockHandler);
              window.removeEventListener("scroll", unlockHandler);
            };

            window.addEventListener("click", unlockHandler, { once: true, passive: true });
            window.addEventListener("keydown", unlockHandler, { once: true, passive: true });
            window.addEventListener("touchstart", unlockHandler, { once: true, passive: true });
            window.addEventListener("scroll", unlockHandler, { once: true, passive: true });
          });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [fadeIn]);

  // Toggle audio ON / OFF
  const toggleAudio = () => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      pauseAudio();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(false));
      } catch {}
    } else {
      audio.currentTime = audio.currentTime || 0;
      audio.play().then(() => {
        fadeIn(audio);
        setIsPlaying(true);
      }).catch(() => {});
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(true));
      } catch {}
    }
  };

  return (
    <>
      {/* Invisible HTML5 Audio Player */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
      />

      {/* Scoped CSS for Tactical Equalizer Animation */}
      <style>{`
        @keyframes heistEq1 {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        @keyframes heistEq2 {
          0%, 100% { height: 13px; }
          50% { height: 5px; }
        }
        @keyframes heistEq3 {
          0%, 100% { height: 6px; }
          50% { height: 16px; }
        }
        @keyframes heistEq4 {
          0%, 100% { height: 12px; }
          50% { height: 7px; }
        }
        .animate-heist-eq-1 { animation: heistEq1 0.75s ease-in-out infinite; }
        .animate-heist-eq-2 { animation: heistEq2 0.65s ease-in-out infinite 0.15s; }
        .animate-heist-eq-3 { animation: heistEq3 0.85s ease-in-out infinite 0.3s; }
        .animate-heist-eq-4 { animation: heistEq4 0.7s ease-in-out infinite 0.2s; }
      `}</style>

      {/* Floating Tactical Audio Controller in Left Corner */}
      <div className="fixed bottom-6 left-6 z-50 select-none">
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isPlaying ? "Turn background audio off" : "Turn background audio on"}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xs border backdrop-blur-md transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.85)] cursor-pointer active:scale-95 ${
            isPlaying
              ? "bg-[#0b0b0b]/90 border-[#E50914]/60 hover:border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.25)]"
              : "bg-[#090909]/85 border-[#262626] hover:border-[#555555]"
          }`}
          title={isPlaying ? "Audio playing · Click to mute" : "Audio muted · Click to play"}
        >
          {/* Status Indicator Icon */}
          <div className="relative flex items-center justify-center shrink-0">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-[#E50914] transition-colors" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            )}
          </div>

          {/* Equalizer Bars (Animated when playing) */}
          <div className="flex items-end gap-[2.5px] h-4 w-4 shrink-0">
            {isPlaying ? (
              <>
                <span className="w-[2.5px] bg-[#E50914] rounded-full animate-heist-eq-1" />
                <span className="w-[2.5px] bg-[#E50914] rounded-full animate-heist-eq-2" />
                <span className="w-[2.5px] bg-[#E50914] rounded-full animate-heist-eq-3" />
                <span className="w-[2.5px] bg-[#E50914] rounded-full animate-heist-eq-4" />
              </>
            ) : (
              <>
                <span className="w-[2.5px] h-[3px] bg-neutral-600 rounded-full" />
                <span className="w-[2.5px] h-[3px] bg-neutral-600 rounded-full" />
                <span className="w-[2.5px] h-[3px] bg-neutral-600 rounded-full" />
                <span className="w-[2.5px] h-[3px] bg-neutral-600 rounded-full" />
              </>
            )}
          </div>

          {/* Text Labels */}
          <div className="flex flex-col text-left">
            <span
              className={`font-mono text-[10px] tracking-[0.2em] uppercase font-bold transition-colors leading-tight ${
                isPlaying ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
              }`}
            >
              {isPlaying ? "AUDIO ON" : "AUDIO OFF"}
            </span>
            <span className="font-mono text-[8px] tracking-[0.25em] text-neutral-500 uppercase leading-none mt-0.5">
              {isPlaying ? "HEIST_OST" : "MUTED"}
            </span>
          </div>

          {/* Subtle corner brackets */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20 pointer-events-none" />
        </button>
      </div>
    </>
  );
}

export default GlobalBackgroundAudio;
