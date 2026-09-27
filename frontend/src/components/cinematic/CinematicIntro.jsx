import React, { useState, useEffect, useRef } from "react";
import PixelCanvas from "./PixelCanvas";
import TypewriterText from "./TypewriterText";
import moneyHeistVideo from "@/assets/videos/moneyheistvd.mp4";

export function CinematicIntro() {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scene1Line1Done, setScene1Line1Done] = useState(false);
  const [scene2Line1Done, setScene2Line1Done] = useState(false);
  
  const videoRef = useRef(null);
  const targetProgress = useRef(0);
  const rafId = useRef(null);

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
    const getScrollRatio = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      return Math.max(0, Math.min(1, scrollY / docHeight));
    };

    const handleScroll = () => {
      targetProgress.current = getScrollRatio();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Silky smooth dampening lerp
    let current = 0;
    const lerpLoop = () => {
      // 0.075 lerp speed creates fluid, cinematic inertia without lag
      current += (targetProgress.current - current) * 0.075;
      if (Math.abs(targetProgress.current - current) < 0.0003) {
        current = targetProgress.current;
      }
      setSmoothProgress(current);
      rafId.current = requestAnimationFrame(lerpLoop);
    };
    rafId.current = requestAnimationFrame(lerpLoop);

    // Keyboard support for presentation/accessibility
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.65, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.65, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Video playback management for Scene 4
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (smoothProgress >= 0.86) {
      if (video.paused && !video.ended) {
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [smoothProgress]);

  // Scene timings
  // Scene 1: Professor & Subtitles (Active from start 0.00 to 0.22)
  const isScene1Active = smoothProgress < 0.22;
  const scene1Opacity = smoothProgress < 0.18 ? 1 : Math.max(0, 1 - (smoothProgress - 0.18) / 0.035);

  // Scene 2: Three Crew Members & Subtitles (0.44 to 0.65)
  const isScene2Active = smoothProgress >= 0.42 && smoothProgress < 0.65;
  const scene2Opacity =
    smoothProgress < 0.42
      ? 0
      : smoothProgress < 0.60
      ? 1
      : Math.max(0, 1 - (smoothProgress - 0.60) / 0.04);

  // Scene 3: Pure Black (0.75 to 0.86)
  const isScene3Active = smoothProgress >= 0.74 && smoothProgress < 0.86;
  const scene3Opacity =
    smoothProgress < 0.74
      ? 0
      : smoothProgress < 0.84
      ? 1
      : Math.max(0, 1 - (smoothProgress - 0.84) / 0.02);

  // Scene 4: Video Reveal (0.86 to 1.00)
  const isScene4Active = smoothProgress >= 0.86;
  const videoOpacity =
    smoothProgress < 0.86
      ? 0
      : Math.min(1, (smoothProgress - 0.86) / 0.03);

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
      {/* Real Scroll Track: 550vh ensures ample scroll control */}
      <div style={{ height: "550vh" }} aria-hidden="true" />

      {/* Pinned Fixed Cinematic Viewport */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center select-none">
        
        {/* Layer 1: Pixel Canvas */}
        <PixelCanvas
          progress={smoothProgress}
          reducedMotion={reducedMotion}
        />

        {/* Layer 2: Subtle Film Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.98) 100%)",
          }}
        />

        {/* Layer 3: Narrative Subtitles */}
        
        {/* SCENE 1 SUBTITLES (The Professor) */}
        <div
          className={`absolute bottom-12 md:bottom-20 left-0 right-0 z-20 px-6 max-w-4xl mx-auto text-center pointer-events-none transition-all duration-700 ease-out ${
            isScene1Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          style={{ opacity: isScene1Active ? scene1Opacity : 0 }}
        >
          <div className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide space-y-3 font-mono">
            <div>
              <TypewriterText
                text="It’s been five months since he found you."
                isActive={true}
                startDelay={300}
                speed={32}
                onComplete={() => setScene1Line1Done(true)}
                reducedMotion={reducedMotion}
                className="text-neutral-200"
              />
            </div>
            <div>
              <TypewriterText
                text="No names. No pasts. Just a knock on the door… and a man who called himself The Professor."
                isActive={scene1Line1Done || smoothProgress > 0.04}
                startDelay={350}
                speed={28}
                reducedMotion={reducedMotion}
                className="text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* SCENE 2 SUBTITLES (Three Crew Members) */}
        <div
          className={`absolute bottom-12 md:bottom-20 left-0 right-0 z-20 px-6 max-w-4xl mx-auto text-center pointer-events-none transition-all duration-700 ease-out ${
            isScene2Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          style={{ opacity: isScene2Active ? scene2Opacity : 0 }}
        >
          <div className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide space-y-3 font-mono">
            <div>
              <TypewriterText
                text="He’d been watching. Waiting. Planning."
                isActive={isScene2Active}
                startDelay={200}
                speed={32}
                onComplete={() => setScene2Line1Done(true)}
                reducedMotion={reducedMotion}
                className="text-neutral-200"
              />
            </div>
            <div>
              <TypewriterText
                text="Today, the training ends."
                isActive={scene2Line1Done || smoothProgress > 0.48}
                startDelay={300}
                speed={32}
                reducedMotion={reducedMotion}
                className="text-neutral-300 text-base md:text-xl font-medium tracking-wider"
              />
            </div>
          </div>
        </div>

        {/* SCENE 3 SUBTITLES (Pure Black Void) */}
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center px-6 text-center pointer-events-none transition-all duration-700 ease-out ${
            isScene3Active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
          style={{ opacity: isScene3Active ? scene3Opacity : 0 }}
        >
          <div className="text-2xl sm:text-3xl md:text-4xl text-neutral-200 font-normal tracking-widest font-mono">
            <TypewriterText
              text="Today… you go in."
              isActive={isScene3Active}
              startDelay={200}
              speed={45}
              reducedMotion={reducedMotion}
              className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]"
            />
          </div>
        </div>

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
          </div>
        </div>

        {/* Subtle cinematic scroll indicator & jump hint */}
        {smoothProgress < 0.85 && (
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
