<template>
  <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "BarChart",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    users: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const series = ref([
      {
        name: "Người dùng",
        data: [],
      },
    ]);
    watch(
      () => props.users,
      (newValue) => {
        if (newValue && newValue.usersByMonth) {
          series.value[0].data = newValue.usersByMonth;
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

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
          text: "Người dùng",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${val}`;
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

</style>
