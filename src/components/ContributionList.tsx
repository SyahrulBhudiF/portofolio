import { AnimatePresence, LazyMotion, domMax, useReducedMotion } from "framer-motion";
import * as m from "framer-motion/m";
import { ChevronDown, ExternalLink, Star } from "lucide-react";
import { type FC, memo, useCallback, useState } from "react";

export interface ContributionLink {
  label: string;
  url: string;
}

export interface ContributionEntry {
  title: string;
  description: string;
  highlights: string[];
  dateLabel: string;
  dateISO: string;
  links: ContributionLink[];
}

export interface ContributionRepo {
  title: string;
  repository: string;
  stars: number;
  entries: ContributionEntry[];
}

interface Props {
  repos: ContributionRepo[];
}

interface RowProps {
  entry: ContributionEntry;
  entryKey: string;
  panelId: string;
  isOpen: boolean;
  onToggle: (key: string) => void;
}

const Row = memo(({ entry, entryKey, panelId, isOpen, onToggle }: RowProps) => {
  // The row bleeds out to the card edge, stopping short of the 3px face border.
  return (
    <li>
      <div className="pixel-row group -mx-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-4">
        <button
          type="button"
          onClick={() => onToggle(entryKey)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex min-w-0 cursor-pointer items-center gap-2 py-2.5 text-left"
        >
          <m.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex shrink-0 text-purple-200/70"
          >
            <ChevronDown size={14} aria-hidden="true" />
          </m.span>
          <span className="truncate text-sm text-white group-hover:text-purple-100">
            {entry.title}
          </span>
        </button>

        <span className="flex shrink-0 items-center gap-3">
          <span className="flex gap-1.5 max-sm:hidden">
            {entry.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-tag px-2.5 py-0.5 text-[0.6875rem] text-white outline-none focus-visible:text-purple-100"
              >
                {link.label}
              </a>
            ))}
          </span>
          <time dateTime={entry.dateISO} className="font-mono text-xs text-white/50">
            {entry.dateLabel}
          </time>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.section
            layout
            id={panelId}
            className="overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <div className="pt-1 pb-4 pl-6">
              <p className="max-w-3xl text-sm leading-relaxed text-white/85">{entry.description}</p>

              {entry.highlights.length > 0 && (
                <ul className="pixel-list mt-3 max-w-3xl space-y-2">
                  {entry.highlights.map((highlight) => (
                    <li
                      key={highlight.slice(0, 40)}
                      className="text-sm leading-relaxed text-white/75"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
                {entry.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-tag px-4 py-1 text-xs text-white outline-none focus-visible:text-purple-100"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </m.section>
        )}
      </AnimatePresence>
    </li>
  );
});

Row.displayName = "ContributionRow";

interface RepoSectionProps {
  repo: ContributionRepo;
  repoIndex: number;
  reduceMotion: ReturnType<typeof useReducedMotion>;
}

const RepoSection = memo(({ repo, repoIndex, reduceMotion }: RepoSectionProps) => {
  // An accordion is scoped to its repository, so expanding one row does not
  // rerender every other repository's contribution list.
  const [openEntry, setOpenEntry] = useState<string | null>(null);
  const toggleEntry = useCallback(
    (key: string) => setOpenEntry((current) => (current === key ? null : key)),
    [],
  );

  return (
    <m.section
      className={repoIndex > 0 ? "mt-5 border-t-2 border-[#652682] pt-5" : ""}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: repoIndex * 0.07, duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
        <a
          href={repo.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-2 text-lg text-white outline-none hover:text-purple-100 focus-visible:text-purple-100"
        >
          <span className="truncate">{repo.title}</span>
          <ExternalLink size={13} aria-hidden="true" className="shrink-0 text-purple-200" />
        </a>

        <span className="flex shrink-0 items-center gap-4 font-mono text-xs text-white/60">
          <span>{repo.entries.length} merged</span>
          <span className="flex items-center gap-1">
            <Star size={12} aria-hidden="true" className="fill-current" />
            {repo.stars.toLocaleString()}
          </span>
        </span>
      </div>

      <ul className="mt-1 flex flex-col">
        {repo.entries.map((entry) => {
          const key = `${repo.repository}-${entry.dateISO}-${entry.title}`;

          return (
            <Row
              key={key}
              entry={entry}
              entryKey={key}
              panelId={`contribution-${repoIndex}-${entry.dateISO}`}
              isOpen={openEntry === key}
              onToggle={toggleEntry}
            />
          );
        })}
      </ul>
    </m.section>
  );
});

RepoSection.displayName = "ContributionRepoSection";

const ContributionList: FC<Props> = ({ repos }) => {
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domMax} strict>
      <m.article
        className="pixel-card"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {repos.map((repo, repoIndex) => (
          <RepoSection
            key={repo.repository}
            repo={repo}
            repoIndex={repoIndex}
            reduceMotion={reduceMotion}
          />
        ))}
      </m.article>
    </LazyMotion>
  );
};

export default ContributionList;
