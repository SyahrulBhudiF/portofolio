import { AnimatePresence, LazyMotion, domMax } from "framer-motion";
import * as m from "framer-motion/m";
import { LucideCalendar1, LucideMapPinned } from "lucide-react";
import { type FC, type KeyboardEvent, useMemo, useRef, useState } from "react";
import ExperienceCard from "./ExperienceCard";

export interface ExperienceItem {
  title: string;
  subtitle: string;
  duration: string;
  location: string;
  description: string[];
  tags?: string[];
  skills?: string[];
}

export interface ExperienceGroup {
  label: string;
  items: ExperienceItem[];
}

interface Props {
  groups: ExperienceGroup[];
}

/** "May 2026 - Present" -> "2026-Now", "Feb 2025 - Dec 2025" -> "2025". */
const compactRange = (duration: string): string => {
  const years = duration.match(/\d{4}/g);
  if (!years?.length) return duration;

  const start = years[0];
  const end = /present|now/i.test(duration) ? "Now" : years[years.length - 1];

  return start === end ? start : `${start}-${end}`;
};

const ExperienceExplorer: FC<Props> = ({ groups }) => {
  // Flatten once so keyboard navigation can walk every tab across group headings.
  const flatItems = useMemo(
    () =>
      groups.flatMap((group, groupIndex) =>
        group.items.map((item, itemIndex) => ({ item, groupIndex, itemIndex })),
      ),
    [groups],
  );

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = flatItems[activeIndex];

  const focusTab = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = flatItems.length - 1;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        focusTab(index === lastIndex ? 0 : index + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index === 0 ? lastIndex : index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(lastIndex);
        break;
      default:
        break;
    }
  };

  if (!active) return null;

  const { item } = active;

  return (
    <LazyMotion features={domMax} strict>
      <>
        {/* Desktop: master-detail. */}
        <div className="max-lg:hidden grid grid-cols-[minmax(200px,224px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,248px)_minmax(0,1fr)] gap-5 xl:gap-6 items-start">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Experience entries"
            className="pixel-panel pixel-panel-static pixel-panel-tight p-4"
          >
            {groups.map((group) => (
              <div key={group.label} className="pixel-tab-group">
                <p className="pixel-tab-label">{group.label}</p>
                {group.items.map((groupItem) => {
                  const index = flatItems.findIndex((entry) => entry.item === groupItem);
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={`${group.label}-${groupItem.title}-${groupItem.duration}`}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`experience-tab-${index}`}
                      aria-selected={isActive}
                      aria-controls="experience-panel"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActiveIndex(index)}
                      onKeyDown={(event) => handleKeyDown(event, index)}
                      className="pixel-tab"
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="min-w-0 flex-1 text-sm leading-tight line-clamp-2">
                          {groupItem.title}
                        </span>
                        <span className="shrink-0 text-[0.6875rem] text-white/50">
                          {compactRange(groupItem.duration)}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-white/60">
                        {groupItem.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <m.div
            layout
            transition={{ duration: 0.25, ease: "easeOut" }}
            id="experience-panel"
            role="tabpanel"
            aria-labelledby={`experience-tab-${activeIndex}`}
            className="pixel-panel pixel-panel-static p-6 xl:p-8"
          >
            <AnimatePresence mode="wait">
              <m.div
                key={activeIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="flex gap-4 justify-between items-start border-b-2 border-[#652682] pb-5 max-xl:flex-col">
                  <div className="min-w-0">
                    <p className="text-xl leading-tight text-white xl:text-2xl break-words">
                      {item.subtitle}
                    </p>
                    <p className="mt-1 text-base leading-snug text-white/70 xl:text-lg break-words">
                      {item.title}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
                      <span className="flex gap-2 items-center">
                        <LucideCalendar1 className="w-4 h-4 shrink-0" />
                        {item.duration}
                      </span>
                      <span aria-hidden="true" className="h-3 w-px bg-white/25" />
                      <span className="flex gap-2 items-center">
                        <LucideMapPinned className="w-4 h-4 shrink-0" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex shrink-0 gap-2 flex-wrap xl:justify-end">
                      {item.tags.map((tag) => (
                        <span key={tag} className="pixel-tag px-5 py-1.5 h-fit text-white text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {item.description.length > 0 && (
                  <ul className="pixel-list mt-5 space-y-2.5">
                    {item.description.map((line) => (
                      <li key={line.slice(0, 40)} className="text-sm text-white/90 leading-relaxed">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                {item.skills && item.skills.length > 0 && (
                  <div className="mt-6 flex gap-2 items-center flex-wrap">
                    {item.skills.map((skill) => (
                      <span key={skill} className="pixel-tag px-4 py-1.5 text-sm text-white">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </m.div>
            </AnimatePresence>
          </m.div>
        </div>

        {/* Mobile: the tab rail has nowhere to live, so fall back to the accordion. */}
        <div className="lg:hidden">
          {groups.map((group) => (
            <div key={group.label} className="mb-8 last:mb-0">
              <h3 className="text-retro text-3xl leading-none text-center text-purple-200 mb-4">
                {group.label}
              </h3>
              <div className="pixel-timeline relative flex flex-col gap-4 pl-8">
                <span className="pixel-timeline-rail" aria-hidden="true" />
                {group.items.map((groupItem, index) => (
                  <div
                    key={`${group.label}-${groupItem.title}-${groupItem.duration}`}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className={`pixel-timeline-node${index === 0 ? " pixel-timeline-node-current" : ""}`}
                    />
                    <ExperienceCard
                      title={groupItem.title}
                      subtitle={groupItem.subtitle}
                      duration={groupItem.duration}
                      location={groupItem.location}
                      description={groupItem.description}
                      tags={groupItem.tags}
                      skills={groupItem.skills}
                      defaultOpen={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    </LazyMotion>
  );
};

export default ExperienceExplorer;
