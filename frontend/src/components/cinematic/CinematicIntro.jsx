import React, { useState, useEffect, useRef } from "react";
import PixelCanvas from "./PixelCanvas";
import ScrollTypewriterBlock from "./ScrollTypewriterBlock";
import CinematicNavbar from "./CinematicNavbar";
import GlitchText from "./GlitchText";
import { useSharedTypewriterAudio } from "@/hooks/useSharedTypewriterAudio";
import moneyHeistVideo from "@/assets/videos/moneyheistvd.mp4";

export function CinematicIntro() {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [isIntroCompleted, setIsIntroCompleted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { isMuted, toggleMute } = useSharedTypewriterAudio();

  const videoRef = useRef(null);
  const targetProgress = useRef(0);
  const maxProgress = useRef(0);
  const rafId = useRef(null);
  const completedRef = useRef(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Multi-input scroll & silky progress controller
  useEffect(() => {
    if (isIntroCompleted) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const getScrollRatio = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      return Math.max(0, Math.min(1, scrollY / docHeight));
    };

    const handleScroll = () => {
      if (completedRef.current) return;
      const ratio = getScrollRatio();
      // Ensure forward-only progress: cannot scroll back into previous chat
      if (ratio > maxProgress.current) {
        maxProgress.current = ratio;
      }
      targetProgress.current = maxProgress.current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Silky smooth dampening lerp
    let current = 0;
    const lerpLoop = () => {
      if (completedRef.current) return;
      // 0.075 lerp speed creates fluid, cinematic inertia without lag
      current += (targetProgress.current - current) * 0.075;
      if (Math.abs(targetProgress.current - current) < 0.0003) {
        current = targetProgress.current;
      }
      setSmoothProgress(current);

      // Once we reach the final video landing page, complete the intro permanently until reload
      if (current >= 0.90 && !completedRef.current) {
        completedRef.current = true;
        setSmoothProgress(1);
        setIsIntroCompleted(true);
        return;
      }

      rafId.current = requestAnimationFrame(lerpLoop);
    };
    rafId.current = requestAnimationFrame(lerpLoop);

    // Keyboard support: forward scroll only, prevent scrolling backwards into previous chat
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.65, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault(); // Prevent scrolling back into previous chat
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isIntroCompleted]);

  // Lock wheel & touch gestures when intro has completed to prevent reverse scrolling
  useEffect(() => {
    if (!isIntroCompleted) return;

    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [isIntroCompleted]);

  // Video playback management for Scene 4
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (smoothProgress >= 0.86 || isIntroCompleted) {
      if (video.paused && !video.ended) {
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => { });
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [smoothProgress, isIntroCompleted]);

  // Scene timings
  // Scene 1: Professor & Subtitles (Active from start 0.00 to 0.22)
  const isScene1Active = !isIntroCompleted && smoothProgress < 0.22;
  const scene1Opacity = smoothProgress < 0.18 ? 1 : Math.max(0, 1 - (smoothProgress - 0.18) / 0.035);

  // Scene 2: Three Crew Members & Subtitles (0.44 to 0.65)
  const isScene2Active = !isIntroCompleted && smoothProgress >= 0.42 && smoothProgress < 0.65;
  const scene2Opacity =
    smoothProgress < 0.42
      ? 0
      : smoothProgress < 0.60
        ? 1
        : Math.max(0, 1 - (smoothProgress - 0.60) / 0.04);

  // Scene 3: Pure Black (0.75 to 0.86)
  const isScene3Active = !isIntroCompleted && smoothProgress >= 0.74 && smoothProgress < 0.86;
  const scene3Opacity =
    smoothProgress < 0.74
      ? 0
      : smoothProgress < 0.84
        ? 1
        : Math.max(0, 1 - (smoothProgress - 0.84) / 0.02);

  // Scene 4: Video Reveal (0.86 to 1.00)
  const isScene4Active = isIntroCompleted || smoothProgress >= 0.86;
  const videoOpacity = isIntroCompleted
    ? 1
    : smoothProgress < 0.86
      ? 0
      : Math.min(1, (smoothProgress - 0.86) / 0.03);

  // Navbar is ONLY visible when the video is revealed or intro completed
  const isNavbarVisible = isIntroCompleted || smoothProgress >= 0.86;

  // Big Glitch Title: ONLY visible when the video is revealed or intro completed
  const isVideoTitleActive = isIntroCompleted || smoothProgress >= 0.86;
  const videoTitleOpacity = isIntroCompleted
    ? 1
    : smoothProgress < 0.86
      ? 0
      : Math.min(1, (smoothProgress - 0.86) / 0.04);

  const scrollToNext = () => {
    let nextTarget = 0.35;
    if (smoothProgress < 0.2) nextTarget = 0.52;
    else if (smoothProgress < 0.5) nextTarget = 0.80;
    else if (smoothProgress < 0.8) nextTarget = 1.0;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: nextTarget * docHeight, behavior: "smooth" });
  };

  return (
    <div className="relative w-full bg-black text-[#f3f4f6]">
      {/* Top Glassmorphism Navigation: THE BRIEFING, THE PLAN, THE LOOT */}
      <CinematicNavbar
        progress={isIntroCompleted ? 1 : smoothProgress}
        visible={isNavbarVisible}
        isIntroCompleted={isIntroCompleted}
        onNavigate={(ratio) => {
          if (isIntroCompleted) return;
          if (ratio >= 0.85) {
            completedRef.current = true;
            setSmoothProgress(1);
            setIsIntroCompleted(true);
            return;
          }
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            window.scrollTo({ top: ratio * docHeight, behavior: "smooth" });
          }
        }}
      />

      {/* Real Scroll Track: only rendered during the prologue before reaching this page */}
      {!isIntroCompleted && (
        <div style={{ height: "550vh" }} className="relative pointer-events-none" aria-hidden="true">
          <div id="narrative-trigger-scene-1" className="absolute top-[20vh] h-[50vh] w-full" />
          <div id="narrative-trigger-scene-2" className="absolute top-[210vh] h-[60vh] w-full" />
          <div id="narrative-trigger-scene-3" className="absolute top-[380vh] h-[60vh] w-full" />
        </div>
      )}

      {/* Pinned Fixed Cinematic Viewport */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center select-none pt-14 md:pt-16">

        {/* Layer 1: Pixel Canvas (unmounted when completed to eliminate previous chat and save performance) */}
        {!isIntroCompleted && (
          <PixelCanvas
            progress={smoothProgress}
            reducedMotion={reducedMotion}
          />
        )}

        {/* Layer 2: Subtle Film Vignette Overlay */}
        {!isIntroCompleted && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.98) 100%)",
            }}
          />
        )}

        {/* Layer 3: Narrative Subtitles (removed permanently once reaching this page) */}
        {!isIntroCompleted && (
          <>
            {/* SCENE 1 SUBTITLES (The Professor) */}
            <div
              className={`absolute bottom-12 md:bottom-20 left-0 right-0 z-20 px-6 max-w-4xl mx-auto text-center pointer-events-none transition-all duration-700 ease-out ${
                isScene1Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              }`}
              style={{ opacity: isScene1Active ? scene1Opacity : 0 }}
            >
              {/* Small mute toggle for the narrative sequence near the first story block */}
              <div className="flex justify-center mb-3">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-black/60 border border-neutral-700/60 text-neutral-400 hover:text-white hover:border-neutral-500 transition-all backdrop-blur-sm select-none"
                  aria-label={isMuted ? "Unmute narrative typewriter audio" : "Mute narrative typewriter audio"}
                >
                  <span>{isMuted ? "🔇" : "🔊"}</span>
                  <span className="text-[10px] tracking-wider uppercase">{isMuted ? "Audio Muted" : "Typewriter Sound"}</span>
                </button>
              </div>

              <div className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide space-y-3">
                <ScrollTypewriterBlock
                  triggerId="narrative-trigger-scene-1"
                  isActive={isScene1Active && smoothProgress > 0.02}
                  lines={[
                    "It’s been five months since he found you.",
                    "No names. No pasts. Just a knock on the door… and a man who called himself The Professor.",
                  ]}
                  wordDelay={150}
                  linePause={500}
                  className="text-neutral-200"
                  lineClassName="text-neutral-200"
                  cursorClassName="bg-red-600"
                />
              </div>
            </div>

            {/* SCENE 2 SUBTITLES (Three Crew Members) */}
            <div
              className={`absolute bottom-12 md:bottom-20 left-0 right-0 z-20 px-6 max-w-4xl mx-auto text-center pointer-events-none transition-all duration-700 ease-out ${
                isScene2Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              }`}
              style={{ opacity: isScene2Active ? scene2Opacity : 0 }}
            >
              <div className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide space-y-3">
                <ScrollTypewriterBlock
                  triggerId="narrative-trigger-scene-2"
                  isActive={isScene2Active}
                  lines={[
                    "He’d been watching. Waiting. Planning.",
                    "Today, the training ends.",
                  ]}
                  wordDelay={150}
                  linePause={500}
                  className="text-neutral-200"
                  lineClassName="text-neutral-200"
                  cursorClassName="bg-red-600"
                />
              </div>
            </div>

            {/* SCENE 3 SUBTITLES (Pure Black Void) */}
            <div
              className={`absolute inset-0 z-20 flex items-center justify-center px-6 text-center pointer-events-none transition-all duration-700 ease-out ${
                isScene3Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
              }`}
              style={{ opacity: isScene3Active ? scene3Opacity : 0 }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl text-neutral-200 font-normal tracking-widest">
                <ScrollTypewriterBlock
                  triggerId="narrative-trigger-scene-3"
                  isActive={isScene3Active}
                  lines={["Today… you go in."]}
                  wordDelay={160}
                  className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                  cursorClassName="bg-white"
                />
              </div>
            </div>
          </>
        )}

        {/* SCENE 4: FINAL VIDEO REVEAL - FIT TO LENGTH */}
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${
            isScene4Active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{
            opacity: videoOpacity,
            visibility: videoOpacity > 0 ? "visible" : "hidden",
          }}
        >
          {/* Fit to full screen length and width */}
          <div className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
            <video
              ref={videoRef}
              className="w-full h-full min-h-screen object-cover"
              playsInline
              muted
              autoPlay
              loop
              preload="auto"
              src={moneyHeistVideo}
              style={{
                outline: "none",
                border: "none",
              }}
            >
              <source src={moneyHeistVideo} type="video/mp4" />
              <source src="/videos/moneyheistvd.mp4" type="video/mp4" />
              <source src="/videos/Money Heist video.mp4" type="video/mp4" />
            </video>

            {/* Seamless edge vignette blending video perimeter into pure black background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 100px 50px #000000",
              }}
            />

            {/* Dark tint overlay behind the title so video motion doesn't reduce contrast */}
            <div className="absolute inset-0 bg-black/25 pointer-events-none" />

            {/* Big Glitch Logo positioned in the upper area above the characters */}
            <div
              className={`absolute top-16 sm:top-20 md:top-24 lg:top-28 left-0 right-0 z-30 px-6 text-center pointer-events-none transition-all duration-700 ease-out ${
                isVideoTitleActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
              style={{ opacity: videoTitleOpacity }}
            >
              <div className="inline-block pointer-events-auto">
                <GlitchText
                  speed={0.8}
                  enableShadows={true}
                  enableOnHover={false}
                  className="font-heist text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white whitespace-nowrap drop-shadow-[0_0_50px_rgba(200,16,46,0.8)]"
                >
                  CODEVERSE 2.0
                </GlitchText>
              </div>
            </div>

          </div>
        </div>

        {/* Subtle cinematic scroll indicator & jump hint (only during intro) */}
        {!isIntroCompleted && smoothProgress < 0.85 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 text-center cursor-pointer group"
            onClick={scrollToNext}
          >
            <div className="flex flex-col items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-mono">
                Scroll to proceed
              </span>
              <div className="w-[1.5px] h-3.5 bg-red-600/80 animate-pulse" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CinematicIntro;
