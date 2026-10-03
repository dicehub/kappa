export const CHART_PALETTE_TOKENS = [
  "--kappa-chart-1",
  "--kappa-chart-2",
  "--kappa-chart-3",
  "--kappa-chart-4",
  "--kappa-chart-5",
  "--kappa-chart-6",
  "--kappa-chart-7",
  "--kappa-chart-8",
] as const;

const LIGHT_PALETTE = [
  "#247ab7",
  "#087f8c",
  "#bb5a15",
  "#337a4b",
  "#9f3f75",
  "#684bb6",
  "#ae3d39",
  "#596579",
] as const;

const DARK_PALETTE = [
  "#8292ff",
  "#4cc4d0",
  "#f4a261",
  "#70c58a",
  "#e084b4",
  "#a78bfa",
  "#f3837e",
  "#aeb6c3",
] as const;

export interface KappaChartTheme {
  background: string;
  foreground: string;
  grid: string;
  muted: string;
  palette: string[];
  surface: string;
  fontFamily: string;
}

const readProperty = (styles: CSSStyleDeclaration, name: string, fallback: string) =>
  styles.getPropertyValue(name).trim() || fallback;

export const readKappaChartTheme = (element: HTMLElement): KappaChartTheme => {
  const styles = getComputedStyle(element);
  const isDark = styles.colorScheme === "dark";
  const fallbackPalette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  return {
    background: readProperty(styles, "--kappa-base", isDark ? "#0f0f0f" : "#ffffff"),
    foreground: readProperty(styles, "--kappa-default", isDark ? "#f5f5f5" : "#171717"),
    grid: readProperty(styles, "--kappa-line", isDark ? "#262626" : "#e7eaef"),
    muted: readProperty(styles, "--kappa-subtle", isDark ? "#a1a1a1" : "#696969"),
    palette: CHART_PALETTE_TOKENS.map((token, index) =>
      readProperty(styles, token, fallbackPalette[index]!),
    ),
    surface: readProperty(styles, "--kappa-control", isDark ? "#18181b" : "#ffffff"),
    fontFamily: styles.fontFamily || "sans-serif",
  };
};

export const createEChartsTheme = (theme: KappaChartTheme) => ({
  color: theme.palette,
  backgroundColor: "transparent",
  textStyle: {
    color: theme.foreground,
    fontFamily: theme.fontFamily,
  },
  title: {
    textStyle: { color: theme.foreground },
    subtextStyle: { color: theme.muted },
  },
  legend: {
    textStyle: { color: theme.muted },
  },
  tooltip: {
    backgroundColor: theme.surface,
    borderColor: theme.grid,
    borderWidth: 1,
    textStyle: { color: theme.foreground },
  },
  categoryAxis: {
    axisLabel: { color: theme.muted },
    axisLine: { lineStyle: { color: theme.grid } },
    axisTick: { lineStyle: { color: theme.grid } },
    splitLine: { lineStyle: { color: theme.grid } },
  },
  valueAxis: {
    axisLabel: { color: theme.muted },
    axisLine: { lineStyle: { color: theme.grid } },
    axisTick: { lineStyle: { color: theme.grid } },
    splitLine: { lineStyle: { color: theme.grid } },
  },
  timeAxis: {
    axisLabel: { color: theme.muted },
    axisLine: { lineStyle: { color: theme.grid } },
    axisTick: { lineStyle: { color: theme.grid } },
    splitLine: { lineStyle: { color: theme.grid } },
  },
  logAxis: {
    axisLabel: { color: theme.muted },
    axisLine: { lineStyle: { color: theme.grid } },
    axisTick: { lineStyle: { color: theme.grid } },
    splitLine: { lineStyle: { color: theme.grid } },
  },
});

export const observeKappaChartTheme = (element: HTMLElement, onChange: () => void) => {
  const roots = new Set<Element>([document.documentElement]);
  const scope = element.closest("[data-kappa-theme], [data-mode]");
  if (scope) roots.add(scope);

  const observer = new MutationObserver(onChange);
  for (const root of roots) {
    observer.observe(root, {
      attributeFilter: ["data-kappa-theme", "data-mode"],
      attributes: true,
    });
  }

  return () => observer.disconnect();
};
