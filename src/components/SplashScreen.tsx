import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SEGMENTS = Array.from({ length: 12 }, (_, index) => index);
const DELAY_MS = 100;
const STAGGER_MS = 120;
const SEGMENT_MS = 350;
const HOLD_MS = 150;
const BG = "linear-gradient(180deg, #0a060f 0%, #201529 55%, #361d41 100%)";

const HIDE_MS = DELAY_MS + STAGGER_MS * (SEGMENTS.length - 1) + SEGMENT_MS + HOLD_MS;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: DELAY_MS / 1000, staggerChildren: STAGGER_MS / 1000 },
  },
};

const segmentVariants = {
  hidden: { opacity: 0.25, scaleY: 1 },
  visible: {
    opacity: 1,
    scaleY: [1, 1.7, 1],
    transition: { duration: SEGMENT_MS / 1000, ease: "easeOut" },
  },
};

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), reduced ? 0 : HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    document.body.style.overflow = showSplash ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center"
          style={{ background: BG }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduced ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          <motion.div
            className="flex h-2.5 gap-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="Loading scene"
          >
            {SEGMENTS.map((segment) => (
              <motion.span
                key={segment}
                variants={segmentVariants}
                className="block h-2.5 w-3 bg-purple-300"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
