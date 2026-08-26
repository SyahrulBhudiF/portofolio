import PixelStarIcon from "./icons/PixelStarIcon";

interface GitHubStarsProps {
  stars: number;
  size?: number;
  className?: string;
}

const GitHubStars = ({ stars, size = 16, className = "" }: GitHubStarsProps) => {
  if (stars < 1) return null;

  return (
    <span className={`flex items-center gap-1 ${className}`} aria-label={`${stars} GitHub stars`}>
      <PixelStarIcon width={size} height={size} /> {stars}
    </span>
  );
};

export default GitHubStars;
