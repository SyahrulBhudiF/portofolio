import { motion, useScroll, useTransform } from "framer-motion";
import type React from "react";
import { useMemo, useRef } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  depth: number;
  animationDelay: string;
  animationDuration: string;
}

const StarBackground: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [200, 0]);

  const stars = useMemo<Star[]>(() => {
    const count = 100;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3,
      opacity: Math.random() * 0.7 + 0.3,
      depth: Math.random() * 2,
      // Randomize animation timing for variety
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));
  }, []);

  return (
    <motion.div ref={ref} className="absolute inset-0 overflow-hidden z-0 h-1/2" style={{ y }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute bg-purple-500 rounded-full ${star.id % 10 !== 0 ? "star-animated" : ""}`}
          style={
            {
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
              transform: `translateY(${star.depth * 50}px)`,
              "--star-opacity": star.opacity,
              "--animation-delay": star.animationDelay,
              "--animation-duration": star.animationDuration,
            } as React.CSSProperties
          }
        />
      ))}
    </motion.div>
  );
};

export default StarBackground;
