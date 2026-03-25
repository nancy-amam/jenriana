"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export type ScrollRevealVariant = "fadeUp" | "fade" | "fadeLeft" | "fadeRight" | "scale";

const presets: Record<
  ScrollRevealVariant,
  { initial: Record<string, number>; animate: Record<string, number> }
> = {
  fadeUp: { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  fadeLeft: { initial: { opacity: 0, x: -28 }, animate: { opacity: 1, x: 0 } },
  fadeRight: { initial: { opacity: 0, x: 28 }, animate: { opacity: 1, x: 0 } },
  scale: { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } },
};

export interface ScrollRevealProps extends Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport"> {
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible (0–1) before animating. Default 0.35 */
  viewportAmount?: number;
  /** Passed to IntersectionObserver via viewport.margin */
  viewportMargin?: string;
}

export function ScrollReveal({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  duration = 0.85,
  viewportAmount = 0.35,
  viewportMargin = "0px",
  ...rest
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const preset = presets[variant];

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={preset.initial}
      whileInView={preset.animate}
      viewport={{ once: true, margin: viewportMargin, amount: viewportAmount }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
