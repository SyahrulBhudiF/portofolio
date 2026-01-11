import type React from "react";
import { cn } from "@/lib/utils";

type TechStackSize = "small" | "medium" | "large";

interface TechStackItemProps {
  tech: string;
  size?: TechStackSize;
  showLabel?: boolean;
}

const sizeClasses: Record<TechStackSize, string> = {
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2 text-base md:text-xl",
  large: "px-6 py-3 text-lg lg:text-2xl",
};

const iconSizeClasses: Record<TechStackSize, string> = {
  small: "w-6 h-6",
  medium: "w-6 h-6 md:w-8 md:h-8",
  large: "w-6 h-6 lg:w-10 lg:h-10",
};

const TechStackItem: React.FC<TechStackItemProps> = ({
  tech,
  size = "medium",
  showLabel = true,
}) => {
  return (
    <div
      className={cn(
        "retro-tech-block relative m-2 flex justify-center items-center gap-1 text-white border-2 border-purple-700/30 rounded-lg cursor-pointer overflow-hidden bg-purple-900/20 group",
        sizeClasses[size]
      )}
    >
      <div className="retro-block-inner flex items-center justify-center gap-2">
        <div className="relative block mr-1">
          <img
            src={`/assets/icon/${tech.toLowerCase()}.svg`}
            alt={tech}
            loading="lazy"
            className={cn(
              iconSizeClasses[size],
              "brightness-150 transition-transform duration-200 ease-out group-hover:scale-110"
            )}
          />
        </div>
        {showLabel && (
          <p className="text-purple-200 group-hover:text-white transition-colors duration-200 ease-out">
            {tech}
          </p>
        )}
      </div>
    </div>
  );
};

export default TechStackItem;
