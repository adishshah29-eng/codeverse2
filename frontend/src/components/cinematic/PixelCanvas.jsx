import React, { useRef, useEffect, useState } from "react";
import professorImg from "@/assets/images/professor.png";
import crewImg from "@/assets/images/crew.png";

// Pseudo-random deterministic hash based on coordinates
function pseudoRandom(x, y, seed = 42) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

// Smoothstep and cubic easing
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
  return x * x * x;
}

export function PixelCanvas({ progress = 0, reducedMotion = false }) {
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef({ professor: null, crew: null });
  const particlesRef = useRef({ professor: [], crew: [] });
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  // Reliable image preloading
  useEffect(() => {
    let isCancelled = false;

    const loadImg = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = src;
        if (img.complete && img.naturalWidth > 0) {
          resolve(img);
        }
      });

    Promise.all([loadImg(professorImg), loadImg(crewImg)]).then(([pImg, cImg]) => {
      if (isCancelled) return;
      imagesRef.current.professor = pImg;
      imagesRef.current.crew = cImg;
      sampleImageParticles(pImg, cImg);
      setImagesLoaded(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Sample grid with higher density for ultra-smooth pixelation
  const sampleImageParticles = (pImg, cImg) => {
    const GRID_W = 160;
    const GRID_H = 90;

    const sample = (img, key) => {
      try {
        const offCanvas = document.createElement("canvas");
        offCanvas.width = GRID_W;
        offCanvas.height = GRID_H;
        const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
        offCtx.drawImage(img, 0, 0, GRID_W, GRID_H);
        const imgData = offCtx.getImageData(0, 0, GRID_W, GRID_H).data;

        const particles = [];
        for (let y = 0; y < GRID_H; y++) {
          for (let x = 0; x < GRID_W; x++) {
            const idx = (y * GRID_W + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const a = imgData[idx + 3] / 255;

            // Skip deep black/background
            const brightness = r * 0.299 + g * 0.587 + b * 0.114;
            if (brightness < 6 || a < 0.04) continue;

            const rnd1 = pseudoRandom(x, y, 23);
            const rnd2 = pseudoRandom(x, y, 79);
            const rnd3 = pseudoRandom(x, y, 149);

            // Smooth organic dispersal trajectories
            const angle = rnd1 * Math.PI * 2;
            const speed = 0.5 + rnd2 * 1.2;
            const dist = 40 + rnd3 * 160;
            const dirX = Math.cos(angle) * dist * speed;
            // Cinematic upward ember drift
            const dirY = (Math.sin(angle) - 0.4) * dist * speed;

            // Staggered wave delay
            const delay = rnd1 * 0.35 + (y / GRID_H) * 0.25;

            particles.push({
              normX: x / GRID_W,
              normY: y / GRID_H,
              r,
              g,
              b,
              a,
              dirX,
              dirY,
              delay,
            });
          }
        }
        particlesRef.current[key] = particles;
      } catch (err) {
        console.warn("Pixel sampling fallback:", err);
      }
    };

    sample(pImg, "professor");
    sample(cImg, "crew");
  };

  // Continuous buttery smooth animation loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      const p = progressRef.current;
      const isReduced = reducedMotionRef.current;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Pure black canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // 16:9 fitted composition box in center
      const targetAspect = 16 / 9;
      let drawW, drawH, drawX, drawY;

      if (width / height > targetAspect) {
        drawH = height;
        drawW = height * targetAspect;
        drawX = (width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = width;
        drawH = width / targetAspect;
        drawX = 0;
        drawY = (height - drawH) / 2;
      }

      const pProf = imagesRef.current.professor;
      const pCrew = imagesRef.current.crew;

      if (!pProf || !pCrew) {
        ctx.restore();
        animId = requestAnimationFrame(render);
        return;
      }

      // Reduced motion fallback: gentle crossfades
      if (isReduced) {
        if (p < 0.28) {
          ctx.globalAlpha = 1;
          ctx.drawImage(pProf, drawX, drawY, drawW, drawH);
        } else if (p < 0.68) {
          const fade = smoothstep(0.28, 0.38, p);
          ctx.globalAlpha = 1 - fade;
          ctx.drawImage(pProf, drawX, drawY, drawW, drawH);
          ctx.globalAlpha = fade;
          ctx.drawImage(pCrew, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
        animId = requestAnimationFrame(render);
        return;
      }

      // ----------------------------------------------------
      // SCENE 1: 0.00 -> 0.22: Professor Image Held
      // ----------------------------------------------------
      if (p < 0.22) {
        ctx.globalAlpha = 1;
        ctx.drawImage(pProf, drawX, drawY, drawW, drawH);
        applyVignette(ctx, drawX, drawY, drawW, drawH);
      }
      // ----------------------------------------------------
      // TRANSITION 1: 0.22 -> 0.44: Ultra-Smooth Pixel Dissolve
      // ----------------------------------------------------
      else if (p >= 0.22 && p < 0.44) {
        const t1 = (p - 0.22) / (0.44 - 0.22); // 0.0 -> 1.0
        const cellSize = Math.ceil(drawW / 160) + 0.8;

        const profParticles = particlesRef.current.professor;
        const crewParticles = particlesRef.current.crew;

        // Seamless cross-blend into particles at start of transition
        if (t1 < 0.08) {
          const baseAlpha = 1 - t1 / 0.08;
          ctx.globalAlpha = baseAlpha;
          ctx.drawImage(pProf, drawX, drawY, drawW, drawH);
        }

        // Subphase 1: 0.0 -> 0.52: Professor dissolves into floating pixels
        if (t1 <= 0.54) {
          const dissolveP = t1 / 0.50;

          for (let i = 0; i < profParticles.length; i++) {
            const pt = profParticles[i];
            const localRaw = (dissolveP - pt.delay * 0.5) / 0.6;
            const localP = Math.max(0, Math.min(1, localRaw));

            if (localP <= 0) {
              const px = drawX + pt.normX * drawW;
              const py = drawY + pt.normY * drawH;
              ctx.fillStyle = `rgb(${pt.r}, ${pt.g}, ${pt.b})`;
              ctx.fillRect(px, py, cellSize, cellSize);
            } else {
              const ease = easeInCubic(localP);
              const px = drawX + pt.normX * drawW + pt.dirX * ease;
              const py = drawY + pt.normY * drawH + pt.dirY * ease;

              const size = Math.max(0.6, cellSize * (1 - ease * 0.7));
              const redBlend = Math.min(ease * 1.4, 1);
              const r = Math.round(pt.r * (1 - redBlend * 0.3) + 135 * redBlend * 0.35);
              const g = Math.round(pt.g * (1 - redBlend * 0.8));
              const b = Math.round(pt.b * (1 - redBlend * 0.8));
              const alpha = Math.max(0, 1 - ease * 1.1);

              if (alpha > 0.01) {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fillRect(px, py, size, size);
              }
            }
          }
        }

        // Subphase 2: 0.44 -> 1.0: Pixels reorganize and construct THREE CREW MEMBERS
        if (t1 >= 0.44) {
          const assembleP = (t1 - 0.44) / (1.0 - 0.44);

          for (let i = 0; i < crewParticles.length; i++) {
            const pt = crewParticles[i];
            const localRaw = (assembleP - (1 - pt.delay) * 0.28) / 0.72;
            const localP = Math.max(0, Math.min(1, localRaw));

            if (localP >= 0.99) {
              const px = drawX + pt.normX * drawW;
              const py = drawY + pt.normY * drawH;
              ctx.fillStyle = `rgb(${pt.r}, ${pt.g}, ${pt.b})`;
              ctx.fillRect(px, py, cellSize, cellSize);
            } else {
              const invEase = 1 - easeOutCubic(localP);
              const px = drawX + pt.normX * drawW + pt.dirX * 0.75 * invEase;
              const py = drawY + pt.normY * drawH + pt.dirY * 0.75 * invEase;

              const size = cellSize * (0.65 + 0.35 * easeOutCubic(localP));
              const alpha = Math.min(1, localP * 1.5);

              const r = Math.round(pt.r * localP + 120 * (1 - localP) * 0.4);
              const g = Math.round(pt.g * localP);
              const b = Math.round(pt.b * localP);

              if (alpha > 0.01) {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fillRect(px, py, size, size);
              }
            }
          }
        }

        // Seamless blend into pristine Crew image at end of transition
        if (t1 > 0.92) {
          const endAlpha = (t1 - 0.92) / 0.08;
          ctx.globalAlpha = endAlpha;
          ctx.drawImage(pCrew, drawX, drawY, drawW, drawH);
        }

        applyVignette(ctx, drawX, drawY, drawW, drawH);
      }
      // ----------------------------------------------------
      // SCENE 2: 0.44 -> 0.65: Three Crew Members Held
      // ----------------------------------------------------
      else if (p >= 0.44 && p < 0.65) {
        ctx.globalAlpha = 1;
        ctx.drawImage(pCrew, drawX, drawY, drawW, drawH);
        applyVignette(ctx, drawX, drawY, drawW, drawH);
      }
      // ----------------------------------------------------
      // TRANSITION 2: 0.65 -> 0.76: Crew Dissolves into Darkness
      // ----------------------------------------------------
      else if (p >= 0.65 && p < 0.76) {
        const t2 = (p - 0.65) / (0.76 - 0.65); // 0.0 -> 1.0
        const cellSize = Math.ceil(drawW / 160) + 0.8;
        const crewParticles = particlesRef.current.crew;

        // Seamless cross-blend into particles at start
        if (t2 < 0.08) {
          ctx.globalAlpha = 1 - t2 / 0.08;
          ctx.drawImage(pCrew, drawX, drawY, drawW, drawH);
        }

        for (let i = 0; i < crewParticles.length; i++) {
          const pt = crewParticles[i];
          const localRaw = (t2 - pt.delay * 0.45) / 0.55;
          const localP = Math.max(0, Math.min(1, localRaw));

          if (localP <= 0) {
            const px = drawX + pt.normX * drawW;
            const py = drawY + pt.normY * drawH;
            ctx.fillStyle = `rgb(${pt.r}, ${pt.g}, ${pt.b})`;
            ctx.fillRect(px, py, cellSize, cellSize);
          } else {
            const ease = easeInCubic(localP);
            const px = drawX + pt.normX * drawW + pt.dirX * ease;
            const py = drawY + pt.normY * drawH + pt.dirY * ease;

            const size = Math.max(0.5, cellSize * (1 - ease * 0.75));
            const redBlend = Math.min(ease * 1.5, 1);
            const r = Math.round(pt.r * (1 - redBlend * 0.3) + 130 * redBlend * 0.3);
            const g = Math.round(pt.g * (1 - redBlend * 0.8));
            const b = Math.round(pt.b * (1 - redBlend * 0.8));
            const alpha = Math.max(0, 1 - ease * 1.15);

            if (alpha > 0.01) {
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.fillRect(px, py, size, size);
            }
          }
        }
        applyVignette(ctx, drawX, drawY, drawW, drawH);
      }
      // ----------------------------------------------------
      // SCENE 3 & 4: 0.76+: Pure Black
      // ----------------------------------------------------
      else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [imagesLoaded]);

  // Soft elliptical vignette
  const applyVignette = (ctx, x, y, w, h) => {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;

    ctx.save();
    const grad = ctx.createRadialGradient(cx, cy, rx * 0.45, cx, cy, rx * 0.98);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.7, "rgba(0,0,0,0.35)");
    grad.addColorStop(0.95, "rgba(0,0,0,0.92)");
    grad.addColorStop(1, "rgba(0,0,0,1)");

    ctx.fillStyle = grad;
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.restore();
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none bg-black flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          transform: "translateZ(0)",
          willChange: "contents",
        }}
      />
    </div>
  );
}

export default PixelCanvas;
