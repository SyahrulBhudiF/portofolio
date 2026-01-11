import type React from "react";

const MountainSVG: React.FC = () => {
  return (
    <div className="absolute bottom-0 w-full h-full max-md:bottom-5 max-sm:bottom-8 overflow-hidden z-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        role="img"
        aria-labelledby="mountain-layer-1"
      >
        <title id="mountain-layer-1">Mountain background layer 1</title>
        <path
          d="M0,64 L360,128 L720,64 L1080,160 L1440,64 V320 H0 Z"
          fill="url(#gradient1)"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        role="img"
        aria-labelledby="mountain-layer-2"
      >
        <title id="mountain-layer-2">Mountain background layer 2</title>
        <path
          d="M0,128 L360,96 L720,192 L1080,128 L1440,128 V320 H0 Z"
          fill="url(#gradient2)"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        role="img"
        aria-labelledby="mountain-layer-3"
      >
        <title id="mountain-layer-3">Mountain background layer 3</title>
        <path
          d="M0,192 L360,160 L720,224 L1080,192 L1440,192 V320 H0 Z"
          fill="url(#gradient3)"
        />
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default MountainSVG;
