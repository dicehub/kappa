import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = (name) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

const root = source("Timer.vue");
const provider = source("TimerRootProvider.vue");
const item = source("TimerItem.vue");
const action = source("TimerActionTrigger.vue");
const styles = source("timer.css");
const barrel = source("index.ts");

test("wraps the Ark timer state machine and forwards its public state", () => {
  assert.match(root, /ArkTimer\.Root/);
  assert.match(root, /v-bind="\$attrs"/);
  assert.match(root, /data-slot="timer"/);
  assert.match(root, /:auto-start="props\.autoStart"/);
  assert.match(root, /:countdown="props\.countdown"/);
  assert.match(root, /:interval="props\.interval"/);
  assert.match(root, /:start-ms="props\.startMs"/);
  assert.match(root, /:target-ms="props\.targetMs"/);
  assert.match(root, /@complete="emit\('complete'\)"/);
  assert.match(root, /@tick="emit\('tick', \$event\)"/);
  assert.match(provider, /ArkTimer\.RootProvider/);
});

test("uses Ark parts and remounts only animated values when they change", () => {
  assert.match(item, /ArkTimer\.Item/);
  assert.match(item, /useTimerContext/);
  assert.match(item, /formattedTime\[props\.type\]/);
  assert.match(item, /:key="renderKey"/);
  assert.match(item, /animate: true/);
  assert.match(action, /ArkTimer\.ActionTrigger/);
  assert.match(action, /:action="props\.action"/);
});

test("uses Kappa tokens and accessible motion fallbacks", () => {
  assert.match(styles, /var\(--kappa-control/);
  assert.match(styles, /font-variant-numeric: tabular-nums/);
  assert.match(styles, /kappa-timer-number-pop-in/);
  assert.match(styles, /\.kappa-timer__action\[hidden\]/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /@media \(forced-colors: active\)/);
  assert.doesNotMatch(styles, /\.(?!kappa-)[a-z][\w-]*|(?<![\w-])--(?!kappa-)[a-z][\w-]*/);
});

test("exports the compound Timer and every granular Ark-backed part", () => {
  for (const name of [
    "Timer",
    "TimerRoot",
    "TimerRootProvider",
    "TimerArea",
    "TimerItem",
    "TimerSeparator",
    "TimerControl",
    "TimerActionTrigger",
    "TimerContext",
    "useTimer",
    "TimerProps",
    "TimerSize",
  ]) {
    assert.match(barrel, new RegExp(name));
  }
});
