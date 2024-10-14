<template>
  <div>
    <DoughnutChartComponent v-if="chartData && options" :data="chartData" :options="options" />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Đăng ký các component cần thiết từ Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "DoughnutChart",
  components: {
    DoughnutChartComponent: Doughnut,
  },
  setup() {
    const chartData = ref(null);
    const options = ref(null);
    onMounted(() => {
      chartData.value = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "My First Dataset",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
            data: [12, 19, 3, 5, 2, 3],
          },
        ],
      };

      options.value = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Pie Chart Example",
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
