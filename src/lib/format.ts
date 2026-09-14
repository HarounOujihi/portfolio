/** Date display — owner dates use year precision for projects (Jan 1 sentinel),
 *  month precision for CV roles. */
export function formatDate(d: Date): string {
  if (d.getUTCDate() === 1 && d.getUTCMonth() === 0) {
    return String(d.getUTCFullYear());
  }
  return d.toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatPeriod(
  start: Date,
  end: Date | null,
  isCurrent: boolean
): string {
  const to = isCurrent || !end ? "present" : formatDate(end);
  return `${formatDate(start)} — ${to}`;
}
