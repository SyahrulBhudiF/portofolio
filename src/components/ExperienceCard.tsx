import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDown, LucideCalendar1, LucideMapPinned } from "lucide-react";
import { type FC, useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";

interface Props {
  title: string;
  subtitle: string;
  duration: string;
  location: string;
  description: string[];
  tags?: string[];
  skills?: string[];
}

const ExperienceCard: FC<Props> = ({
  title,
  subtitle,
  duration,
  location,
  description,
  tags = [],
  skills = [],
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col items-start w-full gap-1 p-4 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700/40 bg-gray-800/30"
    >
      <div className="flex gap-2 justify-between w-full max-lg:flex-col max-lg:items-start">
        <p className="font-medium text-xl">{title}</p>
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="px-3 py-1 h-fit rounded-lg border bg-white text-black text-sm opacity-80"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <p className="font-bold text-lg text-white/70 mb-3">{subtitle}</p>
      <p className="font-medium text-sm text-white/50 flex gap-1 items-center">
        <LucideCalendar1 className="w-4 h-4" />
        {duration}
      </p>
      <p className="font-medium text-sm text-white/50 flex gap-1 items-center">
        <LucideMapPinned className="w-4 h-4" />
        {location}
      </p>

      <div className="w-full flex justify-between items-center mt-2">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-2 text-purple-200 hover:text-purple-300 hover:bg-transparent transition-colors duration-200 cursor-pointer text-xs">
            <span>{isOpen ? "See Less" : "See More"}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronsUpDown className="h-4 w-4" />
            </motion.div>
          </div>
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
                      key={index}
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
                      key={index}
                      className="px-3 py-1 max-sm:px-1 max-sm:text-sm rounded-lg border border-dashed text-sm opacity-65 w-fit hover:opacity-100 hover:border-purple-400 hover:text-purple-300 transition-all duration-200"
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
