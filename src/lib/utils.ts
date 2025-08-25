import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
}
export function formatReadTime(
  content: string,
  wordsPerMinute: number = 200
): string {
  if (!content) return "1 min read";

  // count words
  const words = content.trim().split(/\s+/).length;

  // calculate minutes (at least 1)
  const minutes = Math.ceil(words / wordsPerMinute) || 1;

  return `${minutes} min read`;
}

export function formatMonthDay(isoDate: string | undefined): string {
  if (!isoDate) return "";
  const date = parseISO(isoDate);
  return format(date, "MMM dd"); // "Aug 12"
}
