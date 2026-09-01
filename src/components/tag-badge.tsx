// src/components/tag-badge.tsx
import { Badge } from "@/components/ui/badge";
import type { NewsTag } from "@/lib/news";

const TONE = {
  "JUST IN": "just",
  "BREAKING": "breaking",
  "ALERT": "alert",
  "NEW": "new",
} as const;

// Map tag to display colors
const TAG_COLORS: Record<string, string> = {
  "JUST IN": "bg-red-500/10 text-red-500 border-red-500/30",
  "BREAKING": "bg-orange-500/10 text-orange-500 border-orange-500/30",
  "ALERT": "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  "NEW": "bg-blue-500/10 text-blue-500 border-blue-500/30",
};

export function TagBadge({ tag }: { tag: NewsTag | string }) {
  const colorClass = TAG_COLORS[tag] || TAG_COLORS["NEW"];
  
  return (
    <Badge 
      tone={TONE[tag as NewsTag] || "new"} 
      className={`${colorClass} font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-sm`}
    >
      {tag}
    </Badge>
  );
}
