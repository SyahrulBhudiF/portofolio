import { cn } from "@/lib/utils";
import type React from "react";

type TechStackSize = "small" | "medium" | "large";

interface TechStackItemProps {
  tech: string;
  url: string;
  size?: TechStackSize;
  showLabel?: boolean;
  className?: string;
}

const sizeClasses: Record<TechStackSize, string> = {
  // 8px left the icon flush against the block's edge, since the clip-path's
  // middle band runs all the way out to 0. 16px plus the inner 0.15rem nudge
  // lands on the ~18px the reference blocks use.
  small: "px-4 py-1 text-sm",
  medium: "px-3 py-1.5 text-sm md:text-lg",
  large: "px-6 py-3 text-lg lg:text-2xl",
};

const iconSizeClasses: Record<TechStackSize, string> = {
  small: "w-6 h-6",
  medium: "w-6 h-6 md:w-7 md:h-7",
  large: "w-6 h-6 lg:w-10 lg:h-10",
};

const TechStackItem: React.FC<TechStackItemProps> = ({
  tech,
  url,
  size = "medium",
  showLabel = true,
  className,
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${tech} documentation`}
      className={cn(
        "retro-tech-block relative m-2 flex items-center justify-center gap-1 rounded-lg border-2 border-purple-700/30 bg-purple-900/20 text-white no-underline group",
        sizeClasses[size],
        className,
      )}
    >
      <span className="retro-tech-layer retro-tech-layer-far" aria-hidden="true" />
      <span className="retro-tech-layer retro-tech-layer-middle" aria-hidden="true" />
      <span className="retro-tech-layer retro-tech-layer-near" aria-hidden="true" />
      <span className="retro-tech-border" aria-hidden="true" />
      <div className="retro-block-inner flex items-center justify-center gap-2">
        <div className="relative block mr-1">
          <img
            src={`/assets/icon/${tech.toLowerCase()}.svg`}
            alt=""
            loading="lazy"
            className={cn(
              iconSizeClasses[size],
              "brightness-150 transition-transform duration-200 ease-out group-hover:scale-110",
            )}
          />
        </div>
        {showLabel && (
          <p className="text-purple-200 group-hover:text-white transition-colors duration-200 ease-out">
            {tech}
          </p>
        )}
      </div>
    </a>
  );
};

export default TechStackItem;
