/** Preset value is hours (API); label is user-facing. */
const H = (n: number) => n * 24;
export const frequencyPresets: { value: string; label: string }[] = [
  { value: String(H(1)), label: "1 day" },
  { value: String(H(2)), label: "2 days" },
  { value: String(H(3)), label: "3 days" },
  { value: String(H(7)), label: "1 week" },
  { value: String(H(14)), label: "2 weeks" },
  { value: String(H(30)), label: "1 month" },
  { value: String(H(60)), label: "2 months" },
  { value: String(H(90)), label: "3 months" },
  { value: String(H(180)), label: "6 months" },
  { value: String(H(365)), label: "1 year" },
  { value: String(H(365 * 2)), label: "2 years" },
];

const HOURS_PER_DAY = 24;
const HOURS_PER_WEEK = 24 * 7;
/** Matches preset month lengths (30-day months). */
const HOURS_PER_MONTH = 24 * 30;
const HOURS_PER_YEAR = 24 * 365;

function pluralUnit(n: number, singular: string, plural: string): string {
  return n === 1 ? `1 ${singular}` : `${n} ${plural}`;
}

/** Hours (API) → user-facing label; preset match or derived day/week/month/year/hour phrasing. */
export function formatFrequencyLabel(hours: number): string {
  if (hours <= 0) return "";
  const preset = frequencyPresets.find((p) => p.value === String(hours));
  if (preset) return `Every ${preset.label}`;

  if (hours % HOURS_PER_YEAR === 0) {
    const y = hours / HOURS_PER_YEAR;
    return `Every ${pluralUnit(y, "year", "years")}`;
  }
  if (hours % HOURS_PER_MONTH === 0) {
    const m = hours / HOURS_PER_MONTH;
    return `Every ${pluralUnit(m, "month", "months")}`;
  }
  if (hours % HOURS_PER_WEEK === 0) {
    const w = hours / HOURS_PER_WEEK;
    return `Every ${pluralUnit(w, "week", "weeks")}`;
  }
  if (hours % HOURS_PER_DAY === 0) {
    const d = hours / HOURS_PER_DAY;
    return `Every ${pluralUnit(d, "day", "days")}`;
  }
  return `Every ${hours} hours`;
}