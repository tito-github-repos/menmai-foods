// src/lib/date-utils.ts

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getCutoff(range: string | null): Date | null {
  const now = new Date();
  if (range === "24h") return new Date(now.getTime() - MS_PER_DAY);
  if (range === "7d")  return new Date(now.getTime() - 7  * MS_PER_DAY);
  if (range === "30d") return new Date(now.getTime() - 30 * MS_PER_DAY);
  if (range === "3m")  return new Date(now.getTime() - 90 * MS_PER_DAY);
  return null;
}