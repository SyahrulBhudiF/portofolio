import { useIsMobile } from "@/hooks/useIsMobile";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface Props {
  title: string;
  items: string[];
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2 text-base md:text-xl",
  large: "px-6 py-3 text-lg lg:text-2xl",
};

const iconSizeClasses = {
  small: "w-6 h-6",
  medium: "w-6 h-6 md:w-8 md:h-8",
  large: "w-6 h-6 lg:w-10 lg:h-10",
};

const TechStackItem: React.FC<{
  tech: string;
  size: "small" | "medium" | "large";
}> = ({ tech, size }) => {
  return (
    <div
      className={`retro-tech-block relative m-2 flex justify-center items-center gap-1 text-white border-2 border-purple-700/30 rounded-lg cursor-pointer overflow-hidden bg-purple-900/20 ${sizeClasses[size]}`}
    >
      <div className="retro-block-inner flex items-center justify-center gap-2">
        <div className="relative block mr-1">
          <img
            src={`/assets/icon/${tech.toLowerCase()}.svg`}
            alt={tech}
            loading="lazy"
            className={`${iconSizeClasses[size]} brightness-150`}
          />
        </div>
        <p className="text-purple-200">{tech}</p>
      </div>
    </div>
  );
};

const TechStackCategory: React.FC<Props> = ({ title, items, size = "medium" }) => {
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

  return (
    <div className="w-full">
      <button
        type="button"
        className={`flex items-center gap-2 mb-4 bg-transparent border-none p-0 ${isMobile ? "cursor-pointer" : "cursor-default"}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`tech-stack-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <h3 className="text-2xl font-semibold text-purple-300 max-sm:text-xl">{title}</h3>
        {isMobile && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5 text-purple-300" />
          </motion.div>
        )}
      </button>

      <div id={`tech-stack-${title.toLowerCase().replace(/\s+/g, "-")}`}>
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
