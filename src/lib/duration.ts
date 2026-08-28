/** "May 2026 - Present" -> "2026-Now", "Feb 2025 - Dec 2025" -> "2025". */
export const compactRange = (duration: string): string => {
  const years = duration.match(/\d{4}/g);
  if (!years?.length) return duration;

  const start = years[0];
  const end = /present|now/i.test(duration) ? "Now" : years[years.length - 1];

  return start === end ? start : `${start}-${end}`;
};
