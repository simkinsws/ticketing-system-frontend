import { format } from "date-fns";

export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export function getDateLabel(isoString: string): string {
  const date = new Date(isoString);

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  // Format as "Jan 20, 2026"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDateKey(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * Format date as relative time (e.g., "2m ago", "Just now")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date according to the specified format pattern using date-fns
 * @param isoString ISO date string
 * @param dateFormat Format pattern like "dd-MM-yyyy" or "MMMM dd, yyyy"
 * @param timeFormat Format pattern like "24h" or "12h" (optional)
 * @returns Formatted date string
 */
export function formatDateWithPattern(
  isoString: string,
  dateFormat: string,
  timeFormat?: string,
): string {
  const date = new Date(isoString);

  let formatPattern = dateFormat;

  // Add time format if provided
  if (timeFormat) {
    const timePattern = timeFormat === "24h" ? "HH:mm" : "hh:mm a";
    formatPattern = `${formatPattern}, ${timePattern}`;
  }

  return format(date, formatPattern);
}
