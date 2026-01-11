import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createFadeUpVariants } from "@/lib/animations";

interface Props {
  children: ReactNode;
}

const AboutMotion = ({ children }: Props) => {
  const isMobile = useIsMobile();

  // Use shared animation variants with memoization
  const fadeUpVariants = useMemo(
    () => createFadeUpVariants(isMobile),
    [isMobile],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-16 text-white z-10">
      <motion.div
        className="flex flex-col w-full h-fit 2xl:w-3/4 items-center gap-4"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
      >
        <h2 className="text-6xl font-bold text-retro self-start max-sm:text-5xl">
          About Me
        </h2>
        <p className="text-lg max-sm:text-base">
          As an Informatics Engineering student at Politeknik Negeri Malang, I
          am passionate about advancing my career in Software Development. With
          a strong foundation in both frontend and backend technologies, I have
          hands-on experience with JavaScript frameworks like Next.js and
          SvelteKit, using TypeScript, as well as backend development with
          Laravel, Golang and Typescript too.
          <br />
          <br />I am a quick learner, able to adapt to complex projects and
          deliver innovative solutions. Committed to continuous growth, I am
          eager to contribute my skills in a collaborative, forward-thinking
          environment where I can make meaningful contributions to team goals
          while further developing my technical expertise.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col w-full 2xl:w-3/4 items-center gap-8"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.1 : 0.2 }}
        transition={{
          delay: isMobile ? 0.1 : 0.2,
        }}
      >
        <h2 className="text-6xl font-bold text-retro max-sm:text-5xl">
          Tech Stack
        </h2>
        <div className="w-full flex flex-col gap-6">{children}</div>
      </motion.div>
    </div>
  );
};

export default AboutMotion;
