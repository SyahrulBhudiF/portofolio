import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { compactRange } from "@/lib/duration";
import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { ChevronDown, LucideCalendar1, LucideMapPinned } from "lucide-react";
import { type FC, useState } from "react";

interface Props {
  title: string;
  subtitle: string;
  duration: string;
  location: string;
  description: string[];
  tags?: string[];
  skills?: string[];
  defaultOpen?: boolean;
}

const ExperienceCard: FC<Props> = ({
  title,
  subtitle,
  duration,
  location,
  description,
  tags = [],
  skills = [],
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="pixel-panel flex w-full flex-col items-start p-4"
    >
      {/* Collapsed, a card carries only what identifies the entry: role, place,
          years. Location, tags, bullets and skills are detail, and seven cards
          each showing all of it is what made this section 2,600px on a phone.
          The whole header is the trigger, so the old "See More" line goes too. */}
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-start gap-3 text-left outline-none"
        >
          <m.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-1 flex shrink-0 text-purple-200/70"
          >
            <ChevronDown size={16} aria-hidden="true" />
          </m.span>

          <span className="min-w-0 flex-1">
            <span className="block text-lg leading-tight break-words text-white">{subtitle}</span>
            <span className="mt-0.5 block text-sm leading-snug break-words text-white/70">
              {title}
            </span>
          </span>

          <span className="shrink-0 font-mono text-xs text-white/50">{compactRange(duration)}</span>
        </button>
      </CollapsibleTrigger>

      <AnimatePresence initial={false}>
        {isOpen && (
          <CollapsibleContent asChild forceMount>
            <m.div
              layout
              className="w-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="pt-4 pl-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
                  <span className="flex items-center gap-2">
                    <LucideCalendar1 className="h-4 w-4 shrink-0" />
                    {duration}
                  </span>
                  <span aria-hidden="true" className="h-3 w-px bg-white/25 max-sm:hidden" />
                  <span className="flex items-center gap-2">
                    <LucideMapPinned className="h-4 w-4 shrink-0" />
                    {location}
                  </span>
                </div>

                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="pixel-tag h-fit px-3 py-1.5 text-sm text-white max-sm:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {description.length > 0 && (
                  <ul className="pixel-list mt-4 space-y-2">
                    {description.map((item) => (
                      <li key={item.slice(0, 40)} className="text-sm leading-relaxed text-white/90">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="pixel-tag w-fit px-3 py-1.5 text-sm text-white max-sm:text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </m.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
};

export default ExperienceCard;
