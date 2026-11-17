import type { FC, ReactNode } from "react";

const BOLD_PATTERN = /\*\*(.+?)\*\*/;

/** Renders `**bold**` spans inside content strings; the rest stays plain text. */
const InlineText: FC<{ text: string }> = ({ text }) => {
  const parts: ReactNode[] = [];
  const pattern = new RegExp(BOLD_PATTERN, "g");
  let cursor = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    cursor = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (cursor < text.length) parts.push(text.slice(cursor));

  return <>{parts}</>;
};

export default InlineText;
