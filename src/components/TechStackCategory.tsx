import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type React from "react";
import { useState } from "react";
import TechStackItem from "@/components/ui/TechStackItem";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  title: string;
  items: string[];
  size?: "small" | "medium" | "large";
}

const TechStackCategory: React.FC<Props> = ({
  title,
  items,
  size = "medium",
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isMobile && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const categoryId = `tech-stack-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      <button
        type="button"
        className={`flex items-center gap-2 mb-4 bg-transparent border-none p-0 ${isMobile ? "cursor-pointer" : "cursor-default"}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={categoryId}
      >
        <h3 className="text-2xl font-semibold text-purple-300 max-sm:text-xl">
          {title}
        </h3>
        {isMobile && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-purple-300" />
          </motion.div>
        )}
      </button>

      <div id={categoryId}>
        {isMobile ? (
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 flex-wrap justify-start pb-4">
                  {items.map((tech) => (
                    <TechStackItem key={tech} tech={tech} size={size} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="flex gap-4 flex-wrap justify-start">
            {items.map((tech) => (
              <TechStackItem key={tech} tech={tech} size={size} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStackCategory;
