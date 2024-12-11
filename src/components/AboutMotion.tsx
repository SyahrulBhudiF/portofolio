import React, {type ReactNode} from 'react';
import {motion} from "motion/react"

const AboutMotion = ({children}: { children: ReactNode }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-16 text-white z-10">
            <motion.div className="flex flex-col w-full 2xl:w-3/4 items-center gap-4"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.8,
                                ease: "easeOut"
                            }
                        }}
                        viewport={{once: true, amount: 0.2}}
            >
                <div className="text-6xl font-bold text-retro self-start max-sm:text-4xl">About Me</div>
                <div className="text-lg max-sm:text-base">
                    As an Informatics Engineering student at Politeknik Negeri Malang, I am passionate about advancing
                    my career in Full-Stack Development. With a strong foundation in both frontend and backend
                    technologies, I have hands-on experience with JavaScript frameworks like Next.js and SvelteKit,
                    using
                    TypeScript, as well as backend development with Laravel and Golang. <br/><br/> I am a quick learner, able
                    to
                    adapt
                    to complex projects and deliver innovative solutions. Committed to continuous growth, I am eager to
                    contribute my skills in a collaborative, forward-thinking environment where I can make meaningful
                    contributions to team goals while further developing my technical expertise.
                </div>
            </motion.div>

            <motion.div className="flex flex-col max-w-screen-xl items-center gap-4"
                        initial={{opacity: 0, y: 50}}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.8,
                                ease: "easeOut",
                                delay: 0.3
                            }
                        }}
                        viewport={{once: true, amount: 0.2}}
            >
                <div className="text-6xl font-bold text-retro max-sm:text-4xl">Tech Stack</div>
                <div className="flex gap-4 flex-wrap justify-center">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default AboutMotion;