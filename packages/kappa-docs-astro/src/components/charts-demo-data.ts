export const usageOptions = {
  animationDuration: 360,
  aria: { enabled: false },
  grid: { left: 44, right: 18, top: 20, bottom: 34 },
  tooltip: { trigger: "axis" },
  legend: { bottom: 0, icon: "circle", itemHeight: 7, itemWidth: 7 },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: { type: "value", min: 0, max: 100, axisLabel: { formatter: "{value}%" } },
  series: [
    {
      name: "CPU",
      type: "line",
      data: [42, 48, 46, 63, 58, 36, 31],
      showSymbol: false,
      smooth: 0.22,
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.08 },
    },
    {
      name: "Memory",
      type: "line",
      data: [51, 54, 57, 61, 66, 64, 62],
      showSymbol: false,
      smooth: 0.22,
      lineStyle: { width: 2 },
    },
  ],
};

const scatterData = Array.from({ length: 480 }, (_, index) => {
  const angle = index * 0.31;
  const radius = 0.4 + (index % 37) / 18;
  return [
    Number((Math.cos(angle) * radius + 3.4).toFixed(3)),
    Number((Math.sin(angle * 0.83) * radius * 0.72 + 1.9).toFixed(3)),
  ];
});

export const scatterOptions = {
  animation: false,
  grid: { left: 52, right: 20, top: 18, bottom: 42 },
  tooltip: { trigger: "item" },
  xAxis: { type: "value", name: "Velocity (m/s)", nameLocation: "middle", nameGap: 28 },
  yAxis: { type: "value", name: "Pressure (kPa)", nameLocation: "middle", nameGap: 38 },
  series: [
    {
      name: "Samples",
      type: "scatter",
      data: scatterData,
      symbolSize: 5,
      large: true,
      largeThreshold: 300,
    },
  ],
};

const heatmapHours = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];
const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapData = heatmapDays.flatMap((_day, day) =>
  heatmapHours.map((_hour, hour) => [
    hour,
    day,
    Math.round(10 + 76 * Math.abs(Math.sin((hour + 2) * 0.34 + day * 0.62))),
  ]),
);

export const heatmapOptions = {
  animationDuration: 260,
  grid: { left: 46, right: 24, top: 16, bottom: 52 },
  tooltip: { position: "top" },
  xAxis: { type: "category", data: heatmapHours, splitArea: { show: true } },
  yAxis: { type: "category", data: heatmapDays, splitArea: { show: true } },
  visualMap: {
    min: 0,
    max: 100,
    calculable: false,
    orient: "horizontal",
    left: "center",
    bottom: 0,
    inRange: { color: ["#e9ebef", "#8292ff", "#4356e8"] },
  },
  series: [{ name: "Load", type: "heatmap", data: heatmapData, emphasis: { itemStyle: { borderWidth: 1 } } }],
};

export const sankeyOptions = {
  animationDuration: 420,
  tooltip: { trigger: "item" },
  series: [
    {
      type: "sankey",
      left: 18,
      right: 18,
      top: 16,
      bottom: 16,
      nodeAlign: "justify",
      nodeGap: 14,
      nodeWidth: 8,
      emphasis: { focus: "adjacency" },
      lineStyle: { color: "gradient", curveness: 0.46, opacity: 0.32 },
      label: { fontSize: 11 },
      data: [
        { name: "Geometry" },
        { name: "Surface mesh" },
        { name: "Volume mesh" },
        { name: "Solver" },
        { name: "Results" },
        { name: "Archive" },
      ],
      links: [
        { source: "Geometry", target: "Surface mesh", value: 84 },
        { source: "Geometry", target: "Archive", value: 16 },
        { source: "Surface mesh", target: "Volume mesh", value: 78 },
        { source: "Surface mesh", target: "Archive", value: 6 },
        { source: "Volume mesh", target: "Solver", value: 71 },
        { source: "Volume mesh", target: "Archive", value: 7 },
        { source: "Solver", target: "Results", value: 63 },
        { source: "Solver", target: "Archive", value: 8 },
      ],
    },
  ],
};

const DENSE_POINTS = 100_000;
const denseX = new Float64Array(DENSE_POINTS);
const densePressure = new Float64Array(DENSE_POINTS);
const denseTemperature = new Float64Array(DENSE_POINTS);
for (let index = 0; index < DENSE_POINTS; index += 1) {
  denseX[index] = index * 0.005;
  densePressure[index] = 1.2 + Math.sin(index * 0.007) * 0.18 + Math.sin(index * 0.031) * 0.035;
  denseTemperature[index] = 0.82 + Math.cos(index * 0.0045) * 0.13 + Math.sin(index * 0.019) * 0.025;
}

export const denseData = [denseX, densePressure, denseTemperature];
export const denseSeries = [
  { label: "Pressure", width: 1 },
  { label: "Temperature", width: 1 },
];

export const streamSeries = [
  { label: "p", width: 1.5 },
  { label: "Ux", width: 1.5 },
  { label: "Uy", width: 1.5 },
];

export const createInitialStreamData = () => {
  const x = Array.from({ length: 180 }, (_, index) => index);
  return [
    x,
    x.map((value) => Math.exp(-value / 34) * 0.08 + 0.00012),
    x.map((value) => Math.exp(-value / 26) * 0.045 + 0.00008),
    x.map((value) => Math.exp(-value / 42) * 0.06 + 0.0001),
  ];
};
