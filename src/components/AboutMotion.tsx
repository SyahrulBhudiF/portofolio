import React, {type ReactNode} from 'react';
import {motion} from "motion/react"

const AboutMotion = ({children}: { children: ReactNode }) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const fadeUpVariants = {
        hidden: {
            opacity: 0,
            y: isMobile ? 20 : 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: isMobile ? 0.5 : 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center gap-16 text-white z-10">
            <motion.div
                className="flex flex-col w-full 2xl:w-3/4 items-center gap-4"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: isMobile ? 0.1 : 0.2}}
            >
                <div className="text-6xl font-bold text-retro self-start max-sm:text-5xl">About Me</div>
                <div className="text-lg max-sm:text-base">
                    As an Informatics Engineering student at Politeknik Negeri Malang, I am passionate about advancing
                    my career in Full-Stack Development. With a strong foundation in both frontend and backend
                    technologies, I have hands-on experience with JavaScript frameworks like Next.js and SvelteKit,
                    using
                    TypeScript, as well as backend development with Laravel and Golang. <br/><br/> I am a quick learner,
                    able
                    to
                    adapt
                    to complex projects and deliver innovative solutions. Committed to continuous growth, I am eager to
                    contribute my skills in a collaborative, forward-thinking environment where I can make meaningful
                    contributions to team goals while further developing my technical expertise.
                </div>
            </motion.div>

            <motion.div
                className="flex flex-col max-w-(--breakpoint-xl) items-center gap-4"
                variants={fadeUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: isMobile ? 0.1 : 0.2}}
                transition={{
                    delay: isMobile ? 0.1 : 0.2
                }}
            >
                <div className="text-6xl font-bold text-retro max-sm:text-5xl">Tech Stack</div>
                <div className="flex gap-4 flex-wrap justify-center max-md:justify-start">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default AboutMotion;