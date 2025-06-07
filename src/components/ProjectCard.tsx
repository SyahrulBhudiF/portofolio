import React, {useEffect, useRef, useState} from 'react';
import type {ProjectMeta} from "@/model/projects";
import {motion, useInView} from "motion/react";
import {cn} from "@/lib/utils.ts";

interface ProjectCardProps {
    project: ProjectMeta;
    href?: string;
    isReverse?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({project, href, isReverse}) => {
    const ref = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [imageExists, setImageExists] = useState<boolean | null>(null);

    // Check mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const inView = useInView(ref, {
        amount: isMobile ? 0.15 : 0.25,
        once: true,
        margin: isMobile ? "0px 0px -30px 0px" : "0px 0px -80px 0px"
    });

    useEffect(() => {
        if (!href) {
            setImageExists(false);
            return;
        }

        const img = new Image();
        img.onload = () => setImageExists(true);
        img.onerror = () => setImageExists(false);
        img.src = href;
    }, [href]);

    const TechStack = React.memo(({stack}: { stack: string }) => (
        <div
            className="retro-tech-block relative m-2 flex justify-center items-center gap-2 text-white border-2 border-purple-700/30 rounded-lg cursor-pointer overflow-hidden p-2 bg-purple-900/20 group"
            style={{willChange: 'transform'}}
        >
            <div className="retro-block-inner flex items-center justify-center gap-2">
                <div className="relative block mr-1">
                    <img
                        src={`/assets/icon/${stack.toLowerCase()}.svg`}
                        alt={stack}
                        width={24}
                        height={24}
                        loading="lazy"
                        className="w-6 h-6 brightness-150 transition-transform duration-200 ease-out group-hover:scale-110"
                        style={{willChange: 'transform'}}
                    />
                </div>
                <p className={cn(
                    "text-lg text-purple-200 group-hover:text-white transition-colors duration-200 ease-out",
                    stack === "medium" && "md:text-xl",
                    stack === "large" && "lg:text-2xl"
                )}>
                    {stack}
                </p>
            </div>
        </div>
    ));

    const GithubLink = React.memo(({url, text}: { url: string, text: string }) => (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center w-fit gap-2 bg-transparent text-white px-4 py-2 rounded-lg border-2 border-purple-800 bg-opacity-60 transition-all duration-300 ease-out hover:scale-105 hover:border-2"
            style={{willChange: 'transform'}}
        >
            <img
                src="/assets/icon/github.svg"
                alt="github"
                width={24}
                height={24}
                loading="lazy"
            />
            <span>{text}</span>
        </a>
    ));

    // Clean modern animation variants
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: isMobile ? 20 : 30,
            scale: 0.98
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: isMobile ? 0.6 : 0.8,
                ease: [0.16, 1, 0.3, 1], // Clean easeOutExpo
                opacity: { duration: isMobile ? 0.4 : 0.6 },
                scale: {
                    duration: isMobile ? 0.5 : 0.7,
                    ease: [0.25, 0.1, 0.25, 1] // No bounce, pure smooth
                }
            }
        }
    };

    return (
        <div className="w-full flex justify-center overflow-hidden max-md:p-4">
            <motion.div
                ref={ref}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="flex items-center justify-center w-3/4 max-xl:w-full mt-10 max-md:mt-0"
                style={{willChange: 'transform, opacity'}}
            >
                <div className={cn(
                    "flex self-center gap-4 max-lg:flex-col-reverse",
                    isReverse ? "flex-row-reverse" : "flex-row"
                )}>
                    {imageExists && (
                        <div className="w-full flex flex-col gap-4">
                            <img
                                src={href}
                                alt="cover"
                                className="rounded-lg shadow-xl transition-all duration-300 ease-out"
                                loading="eager"
                                style={{willChange: 'transform'}}
                            />
                            <div className="flex flex-wrap gap-4">
                                {project.stack.map((stack, index) => (
                                    <TechStack key={index} stack={stack}/>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="w-full text-white flex flex-col gap-2">
                        <p className="font-semibold text-3xl text-gray-100">{project.title}</p>
                        <p className="text-xl text-purple-300">{project.type}</p>
                        <p className="text-md text-gray-400 font-semibold">{project.role}</p>
                        <p className="text-base text-gray-300 mt-4 leading-relaxed">{project.description}</p>

                        <div className="grid grid-cols-2 gap-4 w-fit mt-4 max-sm:grid-cols-1">
                            {project.sourceClient && (
                                <GithubLink url={project.sourceClient} text="Client Source"/>
                            )}
                            {project.sourceServer && (
                                <GithubLink url={project.sourceServer} text="Server Source"/>
                            )}
                            {project.sourceModel && (
                                <GithubLink url={project.sourceModel} text="Model Source"/>
                            )}
                        </div>

                        {project?.contributors && (
                            <div className="mt-6 w-full">
                                <p className="font-semibold text-xl text-purple-300 mb-3">Contributors</p>
                                <div className="flex flex-wrap flex-col space-y-2">
                                    {project.contributors.map((contributor, index) => (
                                        <a key={index}
                                           href={contributor.link || "#"}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="flex items-center gap-3 text-gray-300 hover:text-white bg-purple-900/20 hover:bg-purple-800/30 p-2 rounded-lg transition-all duration-300 ease-out border-2 border-purple-700/30 hover:border-purple-700/60"
                                           style={{willChange: 'transform, background-color'}}
                                        >
                                            <div
                                                className="flex items-center justify-center w-8 h-8 bg-purple-700 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                     fill="currentColor"
                                                     className="w-5 h-5 text-white">
                                                    <path
                                                        d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                                                </svg>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-purple-200">{contributor.name}</span>
                                                <span className="text-sm text-gray-400">{contributor.role}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!imageExists && (
                            <div className="flex flex-wrap gap-2 mt-4 -mx-2">
                                {project.stack.map((stack, index) => (
                                    <TechStack key={index} stack={stack}/>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectCard;