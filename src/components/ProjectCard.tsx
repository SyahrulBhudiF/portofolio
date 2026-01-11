import { motion, useInView } from "framer-motion";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createCardVariants } from "@/lib/animations";
import type { ProjectMeta } from "@/model/projects";
import LinkedInIcon from "./icons/LinkedInIcon";
import TechStackItem from "./ui/TechStackItem";

interface GithubLinkProps {
  url: string;
  text: string;
}

const GithubLink: React.FC<GithubLinkProps> = ({ url, text }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center w-fit gap-2 bg-transparent text-white px-4 py-2 rounded-lg border-2 border-purple-800 bg-opacity-60 transition-all duration-300 ease-out hover:scale-105 hover:border-2"
  >
    <img
      src="/assets/icon/github.svg"
      alt={`View ${text} on GitHub`}
      width={24}
      height={24}
      loading="lazy"
    />
    <span>{text}</span>
  </a>
);

interface ContributorLinkProps {
  contributor: {
    name: string;
    role: string;
    link?: string | null;
  };
}

const ContributorLink: React.FC<ContributorLinkProps> = ({ contributor }) => (
  <a
    href={contributor.link || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-gray-300 hover:text-white bg-purple-900/20 hover:bg-purple-800/30 p-2 rounded-lg transition-all duration-300 ease-out border-2 border-purple-700/30 hover:border-purple-700/60"
  >
    <div className="flex items-center justify-center w-8 h-8 bg-purple-700 rounded-full">
      <LinkedInIcon className="w-5 h-5 text-white" />
    </div>
    <div className="flex flex-col">
      <span className="font-medium text-purple-200">{contributor.name}</span>
      <span className="text-sm text-gray-400">{contributor.role}</span>
    </div>
  </a>
);

interface ProjectCardProps {
  project: ProjectMeta;
  href?: string;
  isReverse?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  href,
  isReverse,
}) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const [imageExists, setImageExists] = useState<boolean | null>(null);

  const inView = useInView(ref, {
    amount: isMobile ? 0.15 : 0.25,
    once: true,
    margin: isMobile ? "0px 0px -30px 0px" : "0px 0px -80px 0px",
  });

  const cardVariants = useMemo(() => createCardVariants(isMobile), [isMobile]);

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

  const renderTechStack = () => (
    <div className="flex flex-wrap gap-2 -mx-2">
      {project.stack.map((stack) => (
        <TechStackItem key={stack} tech={stack} size="medium" />
      ))}
    </div>
  );

  const renderGithubLinks = () => (
    <div className="grid grid-cols-2 gap-4 w-fit mt-4 max-sm:grid-cols-1">
      {project.sourceClient && (
        <GithubLink url={project.sourceClient} text="Client Source" />
      )}
      {project.sourceServer && (
        <GithubLink url={project.sourceServer} text="Server Source" />
      )}
      {project.sourceModel && (
        <GithubLink url={project.sourceModel} text="Model Source" />
      )}
    </div>
  );

  const renderContributors = () => {
    if (!project.contributors?.length) return null;

    return (
      <div className="mt-6 w-full">
        <p className="font-semibold text-xl text-purple-300 mb-3">
          Contributors
        </p>
        <div className="flex flex-wrap flex-col space-y-2">
          {project.contributors.map((contributor) => (
            <ContributorLink
              key={`${contributor.name}-${contributor.role}`}
              contributor={contributor}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center overflow-hidden max-md:p-4">
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="flex items-center justify-center w-3/4 max-xl:w-full mt-10 max-md:mt-0"
        style={{ willChange: "transform, opacity" }}
      >
        <div
          className={`flex self-center gap-4 max-lg:flex-col-reverse ${
            isReverse ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {imageExists && (
            <div className="w-full flex flex-col gap-4">
              <img
                src={href}
                alt={`${project.title} project screenshot`}
                className="rounded-lg shadow-xl transition-all duration-300 ease-out"
                loading="eager"
              />
              {renderTechStack()}
            </div>
          )}

          <div className="w-full text-white flex flex-col gap-2">
            <p className="font-semibold text-3xl text-gray-100">
              {project.title}
            </p>
            <p className="text-xl text-purple-300">{project.type}</p>
            <p className="text-md text-gray-400 font-semibold">
              {project.role}
            </p>
            <p className="text-base text-gray-300 mt-4 leading-relaxed">
              {project.description}
            </p>

            {renderGithubLinks()}
            {renderContributors()}

            {!imageExists && <div className="mt-4">{renderTechStack()}</div>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectCard;
