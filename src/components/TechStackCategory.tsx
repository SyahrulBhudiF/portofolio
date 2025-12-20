import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { type ReactNode, useEffect, useState } from "react";

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const TechStackCategory: React.FC<Props> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <div className="flex gap-4 flex-wrap justify-start">{children}</div>
        )}
      </div>
    </div>
  );
};

export default TechStackCategory;
