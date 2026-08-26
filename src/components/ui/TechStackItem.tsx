import { cn } from "@/lib/utils";
import type React from "react";

type TechStackSize = "small" | "medium" | "large";

interface TechStackItemProps {
  tech: string;
  url: string;
  size?: TechStackSize;
  showLabel?: boolean;
  /**
   * "flat" swaps the 3D block for a notched chip. Inside a project card the
   * stack is metadata, so it should not out-shout the title the way the
   * layered block does where badges are the content.
   */
  variant?: "default" | "flat";
  className?: string;
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
  url,
  size = "medium",
  showLabel = true,
  variant = "default",
  className,
}) => {
  const icon = (
    <img
      src={`/assets/icon/${tech.toLowerCase()}.svg`}
      alt=""
      loading="lazy"
      className={cn(
        variant === "flat" ? "h-4 w-4" : iconSizeClasses[size],
        "brightness-150 transition-transform duration-200 ease-out group-hover:scale-110",
      )}
    />
  );

  if (variant === "flat") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${tech} documentation`}
        className={cn(
          "pixel-tag group flex items-center gap-1.5 px-2 py-1 font-[Silkscreen] text-[0.625rem] tracking-wide text-white uppercase no-underline outline-none",
          className,
        )}
      >
        {icon}
        {showLabel && tech}
      </a>
    );
  }

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
        <div className="relative block mr-1">{icon}</div>
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
