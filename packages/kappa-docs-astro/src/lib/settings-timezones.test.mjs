import assert from "node:assert/strict";
import test from "node:test";
import { settingsTimeZoneOption, settingsTimeZoneOptions } from "./settings-timezones.ts";

test("time-zone labels preserve IDs and show seasonal UTC offsets", () => {
  const winter = settingsTimeZoneOption("Europe/Berlin", new Date("2026-01-15T12:00:00Z"));
  const summer = settingsTimeZoneOption("Europe/Berlin", new Date("2026-07-15T12:00:00Z"));
  assert.equal(winter.value, "Europe/Berlin");
  assert.equal(winter.label, "(UTC+01:00) Berlin (Europe)");
  assert.equal(summer.label, "(UTC+02:00) Berlin (Europe)");
});

test("time-zone labels preserve quarter-hour offsets", () => {
  const date = new Date("2026-01-15T12:00:00Z");
  assert.equal(settingsTimeZoneOption("Asia/Kathmandu", date).label, "(UTC+05:45) Kathmandu (Asia)");
});

test("the time-zone list removes duplicates and sorts from west to east", () => {
  const zones = settingsTimeZoneOptions(["Asia/Kathmandu", "UTC", "America/St_Johns", "America/Sao_Paulo", "UTC"], new Date("2026-01-15T12:00:00Z"));
  assert.deepEqual(zones.map(zone => zone.value), ["America/St_Johns", "America/Sao_Paulo", "UTC", "Asia/Kathmandu"]);
});
