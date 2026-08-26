import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { LucideCalendar1, LucideMapPinned } from "lucide-react";
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
      className="pixel-panel flex w-full flex-col items-start p-6 max-sm:p-4"
    >
      <div className="flex w-full gap-3 justify-between max-sm:flex-col">
        <div className="min-w-0 flex-1">
          <p className="text-2xl leading-tight text-white max-sm:text-xl break-words">{subtitle}</p>
          <p className="mt-1 text-base leading-snug text-white/75 max-sm:text-sm break-words">
            {title}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex shrink-0 gap-2 flex-wrap justify-end self-start max-sm:justify-start">
            {tags.map((tag) => (
              <div key={tag} className="pixel-tag px-5 py-1.5 h-fit text-white text-sm max-sm:px-3">
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full pt-4 self-start flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/85">
        <span className="flex gap-2 items-center">
          <LucideCalendar1 className="w-4 h-4 shrink-0" />
          {duration}
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-white/25 max-sm:hidden" />
        <span className="flex gap-2 items-center">
          <LucideMapPinned className="w-4 h-4 shrink-0" />
          {location}
        </span>
      </div>

      <div className="w-full flex justify-between items-center mt-auto pt-2">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="text-[#a23fd0] hover:text-[#c180df] hover:bg-transparent transition-colors duration-200 cursor-pointer text-sm"
          >
            {isOpen ? "See Less" : "See More"}
          </button>
        </CollapsibleTrigger>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="w-full overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pt-4">
              {description.length > 0 && (
                <ul className="list-disc space-y-2">
                  {description.map((item, index) => (
                    <motion.li
                      key={`desc-${item.slice(0, 20)}-${index}`}
                      className="font-medium text-sm text-white ml-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                      }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              )}

              {skills.length > 0 && (
                <motion.div
                  className="flex gap-2 items-center flex-wrap mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      className="pixel-tag px-4 py-1.5 max-sm:px-3 max-sm:text-xs text-sm text-white w-fit"
                      initial={{ y: 150 }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.3 + index * 0.05,
                        duration: 0.3,
                        stiffness: 100,
                      }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Collapsible>
  );
};

export default ExperienceCard;
