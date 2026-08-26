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
    <div className="z-10 flex h-full w-full max-w-6xl flex-col items-center justify-start gap-16 text-white">
      <motion.div
        className="flex flex-col w-full h-fit items-start gap-4"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
      >
        <h2 className="section-title self-start">About Me</h2>
        <p className="max-w-5xl text-lg leading-relaxed max-sm:text-base">
          I'm a software developer focused on building reliable full-stack applications, with a
          particular interest in backend systems. Over the past{" "}
          <strong className="font-bold text-purple-300">two years</strong>, I've worked with
          TypeScript, Laravel, and Go on the backend, and Next.js and TanStack Start on the
          frontend.
          <br />
          <br />
          Comfortable in Linux environments, I learn quickly, adapt to complex projects, and enjoy
          contributing to collaborative teams while continuing to sharpen my technical skills.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col w-full items-start gap-8"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
        transition={{
          delay: isMobile ? 0.1 : 0.2,
        }}
      >
        <h2 className="section-title">Tech Stack</h2>
        <div className="w-full flex flex-col gap-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default AboutMotion;
