import { useIsMobile } from "@/hooks/useIsMobile";
import { createCardVariants } from "@/lib/animations";
import type { ProjectMeta } from "@/model/projects";
import { useInView } from "framer-motion";
import * as m from "framer-motion/m";
import { ExternalLink } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import GitHubStars from "./GitHubStars";

/** Every card shows at most this many badges; the rest collapse into a count. */
const VISIBLE_STACK = 6;

// Secondary to the "View project" tag, so these drop to dim mono text; two
// equally bright buttons is what made the footer read as having no primary.
const linkClassName =
  "relative z-[2] flex items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.12em] text-purple-200 uppercase outline-none transition-colors duration-200 ease-out hover:text-white focus-visible:text-white";

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
  slug: string;
  stars: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, href, slug, stars }) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  // `hasImage: false` is authoritative, so a project that declares it has no
  // cover skips the probe instead of firing a request that 404s.
  const [imageExists, setImageExists] = useState<boolean | null>(project.hasImage ? null : false);

  const inView = useInView(ref, {
    amount: isMobile ? 0.15 : 0.2,
    once: true,
    margin: isMobile ? "0px 0px -30px 0px" : "0px 0px -60px 0px",
  });

  const cardVariants = useMemo(() => createCardVariants(isMobile), [isMobile]);

  useEffect(() => {
    if (!href || !project.hasImage) {
      setImageExists(false);
      return;
    }

    const img = new Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
    img.src = href;
  }, [href, project.hasImage]);

  const shown = project.stack.slice(0, VISIBLE_STACK);
  const hidden = project.stack.slice(VISIBLE_STACK);
  const contributors = project.contributors ?? [];

  return (
    <m.article
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="pixel-accent-card flex h-full flex-col p-5 text-white max-sm:p-4"
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
          // Faint pixel grid so a coverless card still reads as a slot rather
          // than a hole; the frame keeps the row's rhythm either way.
          <div className="flex aspect-[16/9] items-center justify-center gap-6 bg-[#2a1236] bg-[linear-gradient(rgba(193,128,223,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(193,128,223,0.1)_1px,transparent_1px)] bg-size-[14px_14px]">
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

      {/* The title's ::after covers the whole card, so anywhere that is not
          another link opens the detail page. */}
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-retro-card text-2xl leading-tight">
          <a
            href={`/projects/${slug}`}
            className="outline-none after:absolute after:inset-0 after:z-1 after:content-[''] hover:text-purple-100 focus-visible:text-purple-100"
          >
            {project.title}
          </a>
        </h3>
        <GitHubStars stars={stars} size={13} className="relative z-2 shrink-0 text-purple-200/90" />
      </div>

      {/* Type and role drop to dim mono so the title and cover carry the card
          instead of competing with three lines of purple body text. */}
      <p className="mt-1.5 font-mono text-xs tracking-[0.12em] text-purple-200/80 uppercase">
        {project.type} · {project.role}
      </p>

      {/* Clamped so a long description cannot stretch its whole grid row. */}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">
        {project.description}
      </p>

      {/* Bare logos rather than blocks. The blocks were the brightest thing on
          the card, so the eye landed on the framework names instead of the
          project's. No z-index either — these stay under the title's overlay so
          the whole card keeps opening the detail page. */}
      <ul className="mt-4 flex flex-wrap items-center gap-3.5">
        {shown.map((stack) => (
          <li key={stack.name}>
            <img
              src={`/assets/icon/${stack.name.toLowerCase()}.svg`}
              alt={stack.name}
              className="h-6 w-6 brightness-150"
              loading="lazy"
            />
          </li>
        ))}
        {hidden.length > 0 && (
          <li className="font-mono text-xs tracking-[0.08em] text-purple-200/75">
            +{hidden.length}
          </li>
        )}
      </ul>

      {/* mt-auto pins the source links to the card floor across the grid. */}
      <div className="mt-auto pt-5">
        {contributors.length > 0 && (
          <p className="mb-2 truncate font-mono text-xs tracking-[0.12em] text-purple-200/70 uppercase">
            With{" "}
            {contributors.map((contributor, index) => (
              <span key={`${contributor.name}-${contributor.role}`}>
                {index > 0 && ", "}
                {contributor.link ? (
                  <a
                    href={contributor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-[2] text-purple-200 outline-none hover:text-white focus-visible:text-white"
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

        <div className="flex flex-wrap items-center gap-1.5 border-t-2 border-[#652682] pt-3">
          <a
            href={`/projects/${slug}`}
            className="pixel-tag relative z-[2] flex w-fit items-center gap-2 px-3.5 py-1.5 text-xs text-white outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
          >
            View project &rsaquo;
          </a>
          {project.demo && <DemoLink url={project.demo} />}
          {project.sourceClient && <GithubLink url={project.sourceClient} text="Client" />}
          {project.sourceServer && <GithubLink url={project.sourceServer} text="Server" />}
          {project.sourceModel && <GithubLink url={project.sourceModel} text="Model" />}
        </div>
      </div>
    </m.article>
  );
};

export default ProjectCard;
