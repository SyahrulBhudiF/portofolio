import type React from "react";

/**
 * Merge glyph on a 12x12 unit grid: two staircase arms converging into one
 * trunk. Every edge lands on a whole unit, so at a 12px render size each unit
 * is one device pixel and nothing anti-aliases — which is what lucide's
 * round-capped strokes could not do at this size. The earlier node-and-elbow
 * git graph read as a blocky letter "F" once it was this small; a symmetric Y
 * has no letterform to be mistaken for.
 */
const PixelPullRequestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 12 12"
    fill="currentColor"
    shapeRendering="crispEdges"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M1 0h2v2H1zM3 2h2v2H3zM9 0h2v2H9zM7 2h2v2H7zM5 4h2v8H5z" />
  </svg>
);

export default PixelPullRequestIcon;
