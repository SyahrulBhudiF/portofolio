import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import type { Project } from "@/model/projects";
import { AnimatePresence, LazyMotion, domMax } from "framer-motion";
import * as m from "framer-motion/m";
import { useState } from "react";
import ProjectCard from "./ProjectCard";
import PixelDiamondIcon from "./icons/PixelDiamondIcon";

interface ProjectsContainerProps {
  initialProjects: Project[];
  remainingProjects: Project[];
  stars: Record<string, number | null>;
}

const projectStars = (project: Project, stars: Record<string, number | null>) =>
  [project.data.sourceClient, project.data.sourceServer, project.data.sourceModel]
    .flatMap((url) => (url ? [url] : []))
    .reduce((total, url) => total + (stars[url] ?? 0), 0);

interface RemainingProjectsProps {
  projects: Project[];
  stars: Record<string, number | null>;
}

// Own the disclosure state below the initial grid. Expanding projects must not
// rerender the cards that are already visible.
const RemainingProjects = ({ projects, stars }: RemainingProjectsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="col-span-full w-full">
      <div className="flex w-full items-center justify-center">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-label={isOpen ? "Show fewer projects" : "Show more projects"}
            className="relative flex flex-col items-center group cursor-pointer bg-transparent border-none p-2 outline-none transition duration-300 ease-in-out hover:scale-110 focus-visible:scale-110"
          >
            <m.div
              className="relative"
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 1.2,
                ease: "easeInOut",
              }}
            >
              <m.div
                animate={{
                  rotate: isOpen ? 180 : 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 0.5 },
                  scale: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 1.2,
                    ease: "easeInOut",
                    delay: 0.1,
                  },
                }}
              >
                <PixelDiamondIcon className="size-6 text-[#e09eff]" />
              </m.div>
            </m.div>
          </button>
        </CollapsibleTrigger>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            layout
            className="w-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid grid-cols-1 items-stretch gap-6 pt-8 sm:grid-cols-2">
              {projects.map((project, index) => (
                <m.div
                  key={project.id}
                  className="h-full"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.3,
                    },
                  }}
                >
                  <ProjectCard
                    project={project.data}
                    href={`/assets/projects/${project.id}/cover.webp`}
                    slug={project.data.slug ?? project.id}
                    stars={projectStars(project, stars)}
                  />
                </m.div>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </Collapsible>
  );
};

const ProjectsContainer = ({
  initialProjects,
  remainingProjects,
  stars,
}: ProjectsContainerProps) => {
  return (
    <LazyMotion features={domMax} strict>
      <div
        className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2"
        style={{ overflowAnchor: "none" }}
      >
        {initialProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project.data}
            href={`/assets/projects/${project.id}/cover.webp`}
            slug={project.data.slug ?? project.id}
            stars={projectStars(project, stars)}
          />
        ))}

        {remainingProjects.length > 0 && (
          <RemainingProjects projects={remainingProjects} stars={stars} />
        )}
      </div>
    </LazyMotion>
  );
};

export default ProjectsContainer;
