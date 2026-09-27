import React, { useState, useEffect, useRef } from 'react';

/**
 * BlurText - Animates words or sentences from blurred/offset state into crisp focus.
 * Designed for headers, section titles, and key callouts.
 */
export function BlurText({
  text = '',
  className = '',
  wordClassName = '',
  delay = 0,
  duration = 0.5,
  stagger = 0.05,
  as: Component = 'span',
}) {
  const words = text ? text.split(' ') : [];
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component ref={ref} className={`inline-block ${className}`}>
      <span className="inline-block">
        {words.map((word, i) => (
          <span
            key={i}
            className={`inline-block mr-[0.28em] transition-all ${wordClassName}`}
            style={{
              opacity: inView ? 1 : 0,
              filter: inView ? 'blur(0px)' : 'blur(10px)',
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
              transitionDuration: `${duration}s`,
              transitionDelay: `${delay + i * stagger}s`,
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </Component>
  );
}

/**
 * BlurFade - Wraps any section block or paragraph to smoothly unblur and fade in on scroll.
 */
export function BlurFade({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  yOffset = 16,
  blur = '8px',
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        filter: inView ? 'blur(0px)' : `blur(${blur})`,
        transform: inView ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}

export default BlurText;

