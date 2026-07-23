import { Star } from "lucide-react";

interface GitHubStarsProps {
  stars: number;
  size?: number;
  className?: string;
}

const GitHubStars = ({ stars, size = 16, className = "" }: GitHubStarsProps) => {
  if (stars < 1) return null;

  return (
    <span className={`flex items-center gap-1 ${className}`} aria-label={`${stars} GitHub stars`}>
      <Star size={size} aria-hidden fill="currentColor" /> {stars}
    </span>
  );
};

export default GitHubStars;
