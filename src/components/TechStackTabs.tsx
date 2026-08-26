import TechStackItem from "@/components/ui/TechStackItem";
import { motion, useReducedMotion } from "framer-motion";
import { type FC, type KeyboardEvent, useRef, useState } from "react";

export interface TechStackCategoryData {
  title: string;
  items: { name: string; url: string }[];
}

interface Props {
  categories: TechStackCategoryData[];
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const TechStackTabs: FC<Props> = ({ categories }) => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = categories.length - 1;
    const target = {
      ArrowRight: (active + 1) % categories.length,
      ArrowLeft: (active + last) % categories.length,
      Home: 0,
      End: last,
    }[event.key];

    if (target === undefined) return;
    event.preventDefault();
    setActive(target);
    tabRefs.current[target]?.focus();
  };

  if (categories.length === 0) return null;

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="Tech stack categories"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-2 sm:gap-3"
      >
        {categories.map((category, index) => (
          <div key={category.title}>
            <button
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`tech-tab-${slugify(category.title)}`}
              aria-selected={index === active}
              aria-controls={`tech-panel-${slugify(category.title)}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              className="pixel-tab font-mono text-xs tracking-[0.14em] uppercase sm:text-sm"
            >
              {category.title}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 grid">
        {categories.map((category, index) => {
          const isActive = index === active;

          return (
            <motion.div
              key={category.title}
              role="tabpanel"
              id={`tech-panel-${slugify(category.title)}`}
              aria-labelledby={`tech-tab-${slugify(category.title)}`}
              inert={!isActive}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, y: isActive || reduceMotion ? 0 : 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
              className={`col-start-1 row-start-1 grid auto-rows-min content-start grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] md:gap-x-6 md:gap-y-5 ${
                isActive ? "" : "pointer-events-none max-md:hidden"
              }`}
            >
              {category.items.map((tech) => (
                <TechStackItem
                  key={tech.name}
                  tech={tech.name}
                  url={tech.url}
                  className="m-0 w-full justify-start"
                />
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackTabs;
