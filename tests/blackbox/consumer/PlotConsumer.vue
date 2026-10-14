<script setup lang="ts">
import { ref } from "vue";
import { XYPlot, type XYPlotData, type XYPlotProps, type XYPlotSeries, type XYPlotSeriesPath } from "@dicehub/kappa/components/xy-plot";

const paths: XYPlotSeriesPath[] = ["line", "bars", "points", "spline", "stepped"];
const plots = paths.map(path => ({
  path,
  series: [{ label: "Signal", path, color: "#cc2255", width: 3, fill: path === "points" ? "#cc2255" : undefined }] satisfies XYPlotSeries[],
}));
const nativeOptions: XYPlotProps["nativeOptions"] = {
  axes: [{ show: false }, { show: false }], scales: { y: { range: [0, 6] } },
};
const ready = ref<string[]>([]);
const errors = ref<string[]>([]);
const data: XYPlotData = [[0, 1, 2, 3, 4], [1, 4, 2, 5, 1]];
</script>

<template>
  <main>
    <h1>Plot consumer</h1>
    <output aria-label="Ready plots">{{ ready.join(", ") }}</output>
    <p v-for="error in errors" :key="error" role="alert">{{ error }}</p>
    <section v-for="plot in plots" :key="plot.path" :aria-label="`${plot.path} series`" style="width: 400px">
      <XYPlot
        :ariaLabel="`${plot.path} series plot`"
        ariaDescription="Five samples, with two peaks."
        :data="data"
        :series="plot.series"
        :height="240"
        :show-legend="false"
        :show-reset="false"
        :wheel-zoom="false"
        :native-options="nativeOptions"
        x-scale="linear"
        @ready="ready.push(plot.path)"
        @error="errors.push(String($event))"
      />
    </section>
  </main>
</template>
