<template>
  <div>
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "BarChart",
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const series = ref([
      {
        name: "Cũ",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 87, 55, 23],
      },
      {
        name: "Mới",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 45, 25, 32],
      },
    ]);

    const chartOptions = ref({
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    });

    return {
      chartOptions,
      series,
    };
  },
});
</script>

<style scoped>
/* Style cho biểu đồ nếu cần */
</style>
