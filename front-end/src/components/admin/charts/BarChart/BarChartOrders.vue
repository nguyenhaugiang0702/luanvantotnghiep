<template>
  <div>
    <BarChartComponent
      v-if="chartData && options"
      :data="chartData"
      :options="options"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Đăng ký các component cần thiết từ Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "BarChart",
  components: {
    BarChartComponent: Bar,
  },
  setup() {
    const chartData = ref(null);
    const options = ref(null);

    onMounted(() => {
      chartData.value = {
        labels: [
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
        datasets: [
          {
            label: "Sales2",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: [65, 59, 80, 81, 56, 55, 40, 77, 34, 56, 99, 24],
          },
          {
            label: "Sales1",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: [45, 65, 28, 47, 63, 25, 56, 75, 64, 88, 82, 55],
          },
        ],
      };

      options.value = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Sales Over Time",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    });

    return {
      chartData,
      options,
    };
  },
});
</script>

<style scoped>
/* Style cho Bar Chart nếu cần */
</style>
