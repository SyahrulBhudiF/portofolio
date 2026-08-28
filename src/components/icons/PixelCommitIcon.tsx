import type React from "react";

/** Commit glyph: the issue octagon on a line, matching the 12x12 pixel pair. */
const PixelCommitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 12 12"
    fill="currentColor"
    fillRule="evenodd"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M0 5h3v2H0zM9 5h3v2H9zM4 1h4l3 3v4l-3 3H4L1 8V4zM5 3h2l2 2v2l-2 2H5L3 7V5z" />
  </svg>
);

export default PixelCommitIcon;
