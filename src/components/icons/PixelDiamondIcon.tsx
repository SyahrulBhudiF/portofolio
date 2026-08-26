import type React from "react";

/**
 * Diamond with a solid lower half, traced off the reference crop: a 39x39
 * square on its point, 4px outline, fill starting exactly at the horizontal
 * midline. Rotating it 180deg moves the solid half to the top, which is what
 * marks the collapsed and expanded states apart.
 */
const PixelDiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M2 20 38 20 20 38Z" fill="currentColor" />
    <path d="M20 2 38 20 20 38 2 20Z" stroke="currentColor" strokeWidth="4" />
  </svg>
);

export default PixelDiamondIcon;
