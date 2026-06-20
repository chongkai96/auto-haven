/** Display formatters for listing data. */

export function formatPrice(value: number | null): string {
  if (value == null) return "POA";
  return "$" + value.toLocaleString("en-SG");
}

export function formatMileage(km: number | null): string {
  if (km == null) return "—";
  return km.toLocaleString("en-SG") + " km";
}

/** "09-Sep-2008" -> "2008" */
export function regYear(date: string | null): string {
  if (!date) return "—";
  const m = date.match(/(\d{4})/);
  return m ? m[1] : date;
}
