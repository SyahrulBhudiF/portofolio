import { useIsMobile } from "@/hooks/useIsMobile";
import { createFadeUpVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMemo } from "react";

interface Props {
  children: ReactNode;
}

const AboutMotion = ({ children }: Props) => {
  const isMobile = useIsMobile();

  // Use shared animation variants with memoization
  const fadeUpVariants = useMemo(() => createFadeUpVariants(isMobile), [isMobile]);

  return (
    <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center gap-16 text-white z-10">
      <motion.div
        className="flex flex-col w-full h-fit items-center gap-4"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
      >
        <h2 className="text-6xl font-bold text-retro self-start max-sm:text-5xl">About Me</h2>
        <p className="text-lg max-sm:text-base">
          Informatics Engineering student at Politeknik Negeri Malang with{" "}
          <strong className="font-bold text-purple-300">2 years of experience</strong> in software
          development, focusing on Full-Stack Development with a stronger emphasis on backend.
          Experienced in frontend development using Next.js and TanStack Start with TypeScript, and
          backend development using TypeScript, Laravel, and Golang.
          <br />
          <br />
          Proficient in Linux environments, quick to learn new technologies, and adaptable to
          complex projects. Motivated to contribute effectively in collaborative teams while
          continuously improving technical expertise.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col w-full items-center gap-8"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
        transition={{
          delay: isMobile ? 0.1 : 0.2,
        }}
      >
        <h2 className="text-6xl font-bold text-retro max-sm:text-5xl">Tech Stack</h2>
        <div className="w-full flex flex-col gap-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default AboutMotion;
