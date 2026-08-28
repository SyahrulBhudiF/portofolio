import type React from "react";

/**
 * Issue glyph: an octagon ring with a centre dot, the pixel-art stand-in for
 * GitHub's circle. Same 12x12 grid and same 2-unit stroke weight as
 * PixelPullRequestIcon, so the two read as a matched pair inside a tag.
 */
const PixelIssueIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 12 12"
    fill="currentColor"
    fillRule="evenodd"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M4 0h4l4 4v4l-4 4H4L0 8V4zM5 2h2l3 3v2l-3 3H5L2 7V5zM4 4h4v4H4z" />
  </svg>
);

export default PixelIssueIcon;
