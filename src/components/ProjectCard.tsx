import React, {useRef} from 'react';
import type {ProjectMeta} from "@/model/projects";
import {motion, useInView} from "motion/react";
import {cn} from "@/lib/utils.ts";

interface ProjectCardProps {
    project: ProjectMeta;
    href: string;
    isReverse?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({project, href, isReverse}) => {
    const ref = useRef(null);
    const inView = useInView(ref, {amount: 0.2, once: true});

    return (
        <motion.div
            ref={ref}
            initial={{x: isReverse ? "10vw" : "-10vw", opacity: 0}}
            animate={inView ? {x: 0, opacity: 1} : {}}
            transition={{type: "spring", stiffness: 40, damping: 30, duration: 0.8, delay: 0.1}}
            className="flex items-center justify-center w-3/4 max-md:w-full max-md:p-4 mt-10 max-md:mt-0">
            <div
                className={cn("flex gap-4 max-lg:flex-col-reverse", isReverse ? "flex-row-reverse" : "flex-row")}>
                <div className="w-full flex flex-col gap-4">
                    <img src={href} alt="cover" className="rounded-lg shadow-xl" loading="eager"/>
                    <div className="flex flex-wrap gap-4">
                        {project.stack.map((stack, index) => (
                            <div
                                key={index}
                                className={`retro-tech-block relative m-2 flex justify-center items-center gap-2 text-white border-2 border-purple-700/30 rounded-lg cursor-pointer overflow-hidden p-2 bg-purple-900/20 group`}
                            >
                                <div className="retro-block-inner flex items-center justify-center gap-2">
                                    <div className="relative block mr-1">
                                        <img
                                            src={`/assets/icon/${stack.toLowerCase()}.svg`}
                                            alt={stack}
                                            width={24}
                                            height={24}
                                            loading="lazy"
                                            className={`w-6 h-6 brightness-150 group-hover:scale-110 transition-transform`}
                                        />
                                    </div>
                                    <p
                                        className={`text-lg ${stack === "medium" ? "md:text-xl" : ""} ${stack === "large" ? "lg:text-2xl" : ""} text-purple-200 group-hover:text-white transition-colors`}
                                    >
                                        {stack}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={cn("w-full text-white flex flex-col gap-2")}>
                    <p className="font-semibold text-3xl text-gray-100">{project.title}</p>
                    <p className="text-xl text-purple-300">{project.type}</p>
                    <p className="text-base text-gray-300 mt-4 leading-relaxed">{project.description}</p>
                    <div className="grid grid-cols-2 gap-4 w-fit mt-4 max-sm:grid-cols-1">
                        {project.sourceClient && (
                            <a
                                href={project.sourceClient}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-fit gap-2 bg-transparent text-white px-4 py-2 hover:scale-105 rounded-lg transition-all duration-300 border-2 border-purple-800 hover:border-2  bg-opacity-60"
                            >
                                <img
                                    src="/assets/icon/github.svg"
                                    alt="github"
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                />
                                <span>Client Source</span>
                            </a>
                        )}
                        {project.sourceServer && (
                            <a
                                href={project.sourceServer}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-fit gap-2 bg-transparent text-white px-4 py-2 hover:scale-105 rounded-lg transition-all duration-300 border-2 border-purple-800 hover:border-2 bg-opacity-60"
                            >
                                <img
                                    src="/assets/icon/github.svg"
                                    alt="github"
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                />
                                <span>Server Source</span>
                            </a>
                        )}
                        {project.sourceModel && (
                            <a
                                href={project.sourceModel}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center w-fit gap-2 bg-transparent text-white px-4 py-2 hover:scale-105 rounded-lg transition-all duration-300 border-2 border-purple-800 hover:border-2 bg-opacity-60"
                            >
                                <img
                                    src="/assets/icon/github.svg"
                                    alt="github"
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                />
                                <span>Model Source</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;