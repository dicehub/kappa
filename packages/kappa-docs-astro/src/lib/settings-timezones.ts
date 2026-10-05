export interface SettingsTimeZoneOption {
  value: string;
  label: string;
  offset: number;
}

export function settingsTimeZoneOption(value: string, date: Date): SettingsTimeZoneOption {
  const offsetName = new Intl.DateTimeFormat("en", {
    timeZone: value,
    timeZoneName: "longOffset",
  }).formatToParts(date).find(part => part.type === "timeZoneName")!.value;
  const match = offsetName.match(/([+-])(\d{2}):(\d{2})/);
  const offset = match ? (Number(match[2]) * 60 + Number(match[3])) * (match[1] === "-" ? -1 : 1) : 0;
  const offsetText = offset === 0 ? "UTC" : offsetName.replace("GMT", "UTC");
  const parts = value.split("/").map(part => part.replaceAll("_", " "));
  const city = parts.pop()!;
  const name = value === "UTC" ? "Coordinated Universal Time" : `${city}${parts.length ? ` (${parts.join(" / ")})` : ""}`;
  return { value, label: `(${offsetText}) ${name}`, offset };
}

export function settingsTimeZoneOptions(values: readonly string[], date: Date) {
  return [...new Set(values)].map(value => settingsTimeZoneOption(value, date))
    .sort((a, b) => a.offset - b.offset || a.label.localeCompare(b.label, "en"));
}
