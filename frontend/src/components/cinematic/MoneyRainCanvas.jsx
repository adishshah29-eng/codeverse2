import React, { useEffect, useRef, useState } from "react";
import dollarBillFront from "@/assets/images/dollar_bill.png";
import dollarBillBack from "@/assets/images/dollar_bill_back.png";

/**
 * MoneyRainCanvas
 * 
 * Cinematic 3D Money Rain Particle Engine
 * - Photorealistic dual-sided tumbling US dollar bills
 * - 3-tier depth sorting (background, midground, foreground)
 * - Aerodynamic horizontal flutter & oscillation
 * - Realistic motion blur & camera depth-of-field
 * - Middle-phase storm swell (wave crescendo)
 * - Hardware accelerated 60fps canvas rendering
 */
export function MoneyRainCanvas({
  isActive = false,
  onComplete,
  isReducedMotion = false,
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const imagesRef = useRef({ front: null, back: null, loaded: false });
  const [opacity, setOpacity] = useState(1);

  // Preload front and back dollar bill textures
  useEffect(() => {
    let frontLoaded = false;
    let backLoaded = false;

    const imgFront = new Image();
    imgFront.src = dollarBillFront;
    imgFront.onload = () => {
      frontLoaded = true;
      if (backLoaded) imagesRef.current.loaded = true;
    };

    const imgBack = new Image();
    imgBack.src = dollarBillBack;
    imgBack.onload = () => {
      backLoaded = true;
      if (frontLoaded) imagesRef.current.loaded = true;
    };

    imagesRef.current.front = imgFront;
    imagesRef.current.back = imgBack;
  }, []);

  useEffect(() => {
    if (!isActive || isReducedMotion) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    let height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    const updateSize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    updateSize();

    const isMobile = width < 768;
    const totalBills = isMobile ? 22 : 46;

    // Bill base dimensions (aspect ratio ~ 1.7)
    const baseW = isMobile ? 80 : 110;
    const baseH = isMobile ? 47 : 65;

    // Initialize particles with staggered delays and 3D physics properties
    const particles = [];
    for (let i = 0; i < totalBills; i++) {
      // 3 depth tiers: 0 = far, 1 = mid, 2 = near
      const tierRand = Math.random();
      const tier = tierRand < 0.35 ? 0 : tierRand < 0.75 ? 1 : 2;
      
      let scale, speedY, baseAlpha, blur;
      if (tier === 0) {
        scale = 0.38 + Math.random() * 0.15;
        speedY = 3.2 + Math.random() * 1.8;
        baseAlpha = 0.55 + Math.random() * 0.2;
        blur = 1.2;
      } else if (tier === 1) {
        scale = 0.65 + Math.random() * 0.2;
        speedY = 5.5 + Math.random() * 2.2;
        baseAlpha = 0.85 + Math.random() * 0.12;
        blur = 0;
      } else {
        scale = 0.95 + Math.random() * 0.25;
        speedY = 8.5 + Math.random() * 3.5;
        baseAlpha = 0.95 + Math.random() * 0.05;
        blur = 0;
      }

      // Middle-phase swell: first half starts early, second half bursts at 0.7s-1.5s
      const isSecondWave = i >= Math.floor(totalBills * 0.45);
      const startDelay = isSecondWave
        ? 0.7 + Math.random() * 0.9 // Burst wave during peak rain
        : Math.random() * 0.6;      // Initial wave

      particles.push({
        x: Math.random() * (width + 120) - 60,
        y: -baseH * scale - Math.random() * 250,
        tier,
        scale,
        speedY,
        baseAlpha,
        blur,
        // Tumbling in 3D: rotX is pitch (flipping front/back), rotZ is tilt
        rotX: Math.random() * Math.PI * 2,
        rotXSpeed: (0.025 + Math.random() * 0.045) * (Math.random() < 0.5 ? 1 : -1),
        rotZ: (Math.random() - 0.5) * 0.8,
        rotZSpeed: (Math.random() - 0.5) * 0.018,
        // Aerodynamic horizontal sway
        swayFreq: 1.8 + Math.random() * 1.5,
        swayAmp: 18 + Math.random() * 35 * scale,
        phase: Math.random() * Math.PI * 2,
        startDelay,
        hasStarted: false,
        active: true,
      });
    }

    // Sort by tier so distant bills render behind near bills
    particles.sort((a, b) => a.tier - b.tier);

    let startTime = performance.now();
    const DURATION = 3200; // 3.2 seconds total sequence duration
    const FADE_START = 2400; // Start smooth fade out at 2.4s

    setOpacity(1);

    const render = (now) => {
      const elapsed = (now - startTime);
      const timeSec = elapsed / 1000;

      // Check for fade out phase
      if (elapsed >= FADE_START) {
        const fadeProg = Math.min(1, (elapsed - FADE_START) / (DURATION - FADE_START));
        setOpacity(Math.max(0, 1 - fadeProg));
      }

      if (elapsed >= DURATION) {
        setOpacity(0);
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const { front, back, loaded } = imagesRef.current;
      if (!loaded || !front || !back) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (timeSec < p.startDelay) continue;
        p.hasStarted = true;

        // Physics step
        p.y += p.speedY;
        p.rotX += p.rotXSpeed;
        p.rotZ += p.rotZSpeed;

        // Flutter sway offset
        const sway = Math.sin(timeSec * p.swayFreq + p.phase) * p.swayAmp;
        const currentX = p.x + sway;
        const currentY = p.y;

        // Cosine projection for 3D tumbling around X-axis
        const cosX = Math.cos(p.rotX);
        const billImg = cosX >= 0 ? front : back;
        const absCosX = Math.max(0.08, Math.abs(cosX));

        const w = baseW * p.scale;
        const h = baseH * p.scale * absCosX;

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(p.rotZ);

        // Alpha calculation
        ctx.globalAlpha = p.baseAlpha;

        // Subtle motion blur for near foreground bills moving fast
        if (p.tier === 2 && p.speedY > 9) {
          ctx.globalAlpha = p.baseAlpha * 0.3;
          ctx.drawImage(billImg, -w / 2, -h / 2 - p.speedY * 0.4, w, h);
          ctx.globalAlpha = p.baseAlpha;
        }

        // Draw the primary banknote
        ctx.drawImage(billImg, -w / 2, -h / 2, w, h);

        // Subtle top light sheen on the bill as it tumbles into light
        if (absCosX > 0.4 && p.tier > 0) {
          const sheenAlpha = (1 - absCosX) * 0.25;
          ctx.fillStyle = `rgba(255, 255, 255, ${sheenAlpha})`;
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      updateSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, isReducedMotion, onComplete]);

  if (isReducedMotion) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden transition-opacity duration-700 ease-out"
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}

export default MoneyRainCanvas;
