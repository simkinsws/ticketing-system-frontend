// Some backends return ISO strings without timezone info (e.g., "2026-01-22T08:27:00").
// Interpret them as UTC to avoid showing times shifted backwards by the local offset.
export function formatTime(iso: string): string {
  const hasZone = /Z|[+-]\d\d:?\d\d$/.test(iso);
  const normalized = hasZone ? iso : `${iso}Z`;
  const d = new Date(normalized);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
