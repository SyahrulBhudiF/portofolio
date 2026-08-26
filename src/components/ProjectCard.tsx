import { useIsMobile } from "@/hooks/useIsMobile";
import { createCardVariants } from "@/lib/animations";
import type { ProjectMeta } from "@/model/projects";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import GitHubStars from "./GitHubStars";
import TechStackItem from "./ui/TechStackItem";

/** Every card shows at most this many badges; the rest collapse into a count. */
const VISIBLE_STACK = 6;

const linkClassName =
  "pixel-tag flex w-fit items-center gap-1.5 px-2.5 py-1 text-xs text-white outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5";

const GithubLink: React.FC<{ url: string; text: string }> = ({ url, text }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
    <img src="/assets/icon/github.svg" alt="" width={14} height={14} loading="lazy" />
    <span>{text}</span>
  </a>
);

const DemoLink: React.FC<{ url: string }> = ({ url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
    <ExternalLink size={13} aria-hidden />
    <span>Live Demo</span>
  </a>
);

interface ProjectCardProps {
  project: ProjectMeta;
  href?: string;
  stars: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, href, stars }) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const [imageExists, setImageExists] = useState<boolean | null>(null);

  const inView = useInView(ref, {
    amount: isMobile ? 0.15 : 0.2,
    once: true,
    margin: isMobile ? "0px 0px -30px 0px" : "0px 0px -60px 0px",
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

  const shown = project.stack.slice(0, VISIBLE_STACK);
  const hidden = project.stack.slice(VISIBLE_STACK);
  const contributors = project.contributors ?? [];

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="pixel-accent-card flex h-full flex-col p-5 text-white max-sm:p-4"
      style={{ willChange: "transform, opacity" }}
    >
      {/* The frame is always present, so the card never reflows between the
          probe resolving and the cover painting. */}
      <div className="pixel-photo">
        {imageExists ? (
          <img
            src={href}
            alt={`${project.title} project screenshot`}
            className="aspect-[16/9] object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="pixel-cover-fallback flex aspect-[16/9] items-center justify-center gap-6">
            {imageExists === false &&
              project.stack
                .slice(0, 3)
                .map((stack) => (
                  <img
                    key={stack.name}
                    src={`/assets/icon/${stack.name.toLowerCase()}.svg`}
                    alt=""
                    className="h-10 w-10 brightness-150 max-sm:h-8 max-sm:w-8"
                    loading="lazy"
                  />
                ))}
          </div>
        )}
      </div>

      <h3 className="text-retro-card mt-3 text-2xl leading-tight">{project.title}</h3>

      {/* Type and role drop to dim mono so the title and cover carry the card
          instead of competing with three lines of purple body text. */}
      <p className="mt-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-purple-300/70 uppercase">
        {project.type} · {project.role}
      </p>

      {/* Clamped so a long description cannot stretch its whole grid row. */}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {shown.map((stack) => (
          <TechStackItem key={stack.name} tech={stack.name} url={stack.url} variant="flat" />
        ))}
        {hidden.length > 0 && (
          <span
            className="font-mono text-[0.625rem] tracking-wide text-purple-300/70"
            title={hidden.map((stack) => stack.name).join(", ")}
          >
            +{hidden.length} more
          </span>
        )}
      </div>

      {/* mt-auto pins the footer to the card floor, so a row of cards lines its
          links and stars up even when the copy above them differs in length. */}
      <div className="mt-auto pt-5">
        {contributors.length > 0 && (
          <p className="mb-2 truncate font-mono text-[0.625rem] tracking-[0.16em] text-purple-300/60 uppercase">
            With{" "}
            {contributors.map((contributor, index) => (
              <span key={`${contributor.name}-${contributor.role}`}>
                {index > 0 && ", "}
                {contributor.link ? (
                  <a
                    href={contributor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-200 outline-none hover:text-white focus-visible:text-white"
                  >
                    {contributor.name}
                  </a>
                ) : (
                  contributor.name
                )}
              </span>
            ))}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t-2 border-[#652682] pt-3">
          <div className="flex flex-wrap gap-2">
            {project.demo && <DemoLink url={project.demo} />}
            {project.sourceClient && <GithubLink url={project.sourceClient} text="Client Source" />}
            {project.sourceServer && <GithubLink url={project.sourceServer} text="Server Source" />}
            {project.sourceModel && <GithubLink url={project.sourceModel} text="Model Source" />}
          </div>
          <GitHubStars stars={stars} className="text-purple-200" />
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
