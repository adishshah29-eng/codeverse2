import React from 'react';
import { motion } from 'motion/react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <Component className={`inline-block ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="inline-block"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className={`inline-block mr-[0.28em] ${wordClassName}`}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
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
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: `blur(${blur})`,
        y: yOffset,
      }}
      whileInView={{
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
      }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default BlurText;
