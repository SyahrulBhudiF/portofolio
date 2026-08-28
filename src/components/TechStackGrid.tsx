import TechStackItem from "@/components/ui/TechStackItem";
import type { FC } from "react";

export interface TechStackCategoryData {
  title: string;
  items: { name: string; url: string }[];
}

interface Props {
  categories: TechStackCategoryData[];
}

/**
 * A stack list is scanned, not read, so nothing is hidden behind a tab. Height
 * is kept down by sizing chips to their own label instead of a 12rem column
 * track — "PHP" and "TailwindCSS" no longer occupy the same width — and by
 * running the category label down the left rather than on its own row.
 */
const TechStackGrid: FC<Props> = ({ categories }) => {
  if (categories.length === 0) return null;

  return (
    <ul className="flex w-full flex-col gap-5 md:gap-6">
      {categories.map((category) => (
        <li
          key={category.title}
          className="grid gap-x-6 gap-y-2 md:grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] md:items-baseline"
        >
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-purple-300/60 uppercase md:pt-1.5">
            {category.title}
          </p>

          <div className="flex flex-wrap gap-1.5 md:gap-2.5">
            {category.items.map((tech) => (
              <TechStackItem
                key={tech.name}
                tech={tech.name}
                url={tech.url}
                size="compact"
                className="m-0 w-fit"
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TechStackGrid;
