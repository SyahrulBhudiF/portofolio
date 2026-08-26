import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type FC, type PointerEvent, type ReactNode, useRef } from "react";

interface MagneticProps {
  children: ReactNode;
  /** Classes for the element that actually moves. */
  className?: string;
  /**
   * Share of the distance from centre that the content leans. The original is
   * written for buttons, where the element tracks the cursor outright; on a
   * 500px thumbnail that reads as the image coming loose, so this scales it
   * down to a lean of roughly 12px at the corners.
   */
  pull?: number;
}

/**
 * Spring taken from Olivier Larose's magnetic button tutorial:
 * https://blog.olivierlarose.com/tutorials/magnetic-button
 * The very light mass is what gives it the quick, clean settle — heavier
 * values just make it feel sluggish.
 */
const MAGNETIC_SPRING = { stiffness: 150, damping: 15, mass: 0.1 };

const Magnetic: FC<MagneticProps> = ({ children, className, pull = 0.05 }) => {
  const reduceMotion = useReducedMotion();
  const areaRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNETIC_SPRING);
  const springY = useSpring(y, MAGNETIC_SPRING);

  const track = (event: PointerEvent<HTMLSpanElement>) => {
    // Coarse pointers have no hover, so a touch would only yank the element
    // sideways on the way to a tap.
    if (reduceMotion || event.pointerType !== "mouse") return;

    const area = areaRef.current;
    if (!area) return;

    const { left, top, width, height } = area.getBoundingClientRect();
    x.set((event.clientX - (left + width / 2)) * pull);
    y.set((event.clientY - (top + height / 2)) * pull);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    // The measurement and the listeners belong on this static wrapper. The
    // original measures the moving element itself, which feeds its own
    // displacement back in; harmless on a small button, but it drifts on
    // something this size.
    <span ref={areaRef} onPointerMove={track} onPointerLeave={release} className="block">
      <motion.span style={{ x: springX, y: springY }} className={className}>
        {children}
      </motion.span>
    </span>
  );
};

export default Magnetic;
