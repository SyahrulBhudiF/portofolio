import {useRef, useState} from 'react';
import ProjectCard from './ProjectCard';
import {motion, AnimatePresence} from 'framer-motion';
import type {Project} from '@/model/projects';
import {LucideChevronDown} from "lucide-react";
import {Collapsible, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Button} from "@/components/ui/button.tsx";

interface ProjectsContainerProps {
    initialProjects: Project[];
    remainingProjects: Project[];
}

const ProjectsContainer = ({initialProjects, remainingProjects}: ProjectsContainerProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="w-full grid grid-cols-1 items-center gap-10"
             style={{overflowAnchor: "none"}}>
            {initialProjects.map((project, index) => (
                <ProjectCard
                    key={project.slug}
                    project={project.data}
                    href={`assets/projects/${project.slug}/cover.webp`}
                    isReverse={false}
                />
            ))}

            {remainingProjects.length > 0 && (
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full"
                >
                    <div className="w-full flex justify-center items-center mt-8">
                        <CollapsibleTrigger asChild>
                            <div
                                className="relative flex flex-col items-center group cursor-pointer transition duration-300 ease-in-out hover:scale-110"
                            >
                                <span
                                    className="text-lg mb-2 px-4 py-2 bg-purple-900/20 border border-purple-700/30 text-purple-300 rounded-lg shadow-lg"
                                >
                                    {isOpen ? "See Less" : "See More"}
                                </span>

                                <motion.div
                                    className="relative"
                                    animate={{
                                        y: [0, 5, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        duration: 1.2,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            rotate: isOpen ? 180 : 0,
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            rotate: {duration: 0.5},
                                            scale: {
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                duration: 1.2,
                                                ease: "easeInOut",
                                                delay: 0.1
                                            }
                                        }}
                                    >
                                        <LucideChevronDown className="text-purple-500" size={24}/>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </CollapsibleTrigger>
                    </div>

                    <AnimatePresence initial={false}>
                        {isOpen && (
                            <motion.div
                                className="w-full overflow-hidden"
                                initial={{height: 0, opacity: 0}}
                                animate={{height: "auto", opacity: 1}}
                                exit={{height: 0, opacity: 0}}
                                transition={{duration: 0.3, ease: "easeInOut"}}
                            >
                                <div className="pt-8 grid grid-cols-1 gap-10">
                                    {remainingProjects.map((project, index) => (
                                        <motion.div
                                            key={project.slug}
                                            initial={{opacity: 0, y: -20}}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    delay: index * 0.1,
                                                    duration: 0.3
                                                }
                                            }}
                                        >
                                            <ProjectCard
                                                project={project.data}
                                                href={`assets/projects/${project.slug}/cover.webp`}
                                                isReverse={false}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Collapsible>
            )}
        </div>
    );
};

export default ProjectsContainer;