<template>
  <div>
    <DoughnutChartComponent
      v-if="chartData && options"
      :data="chartData"
      :options="options"
      class="categories-chart"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
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
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

export default defineComponent({
  name: "DoughnutChart",
  components: {
    DoughnutChartComponent: Doughnut,
  },
  props: {
    categories: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const chartData = ref(null);
    const options = ref(null);

    const updateChart = (categories) => {
      chartData.value = {
        labels: categories.categoryNames || [], // Gán mảng tên thể loại
        datasets: [
          {
            label: "Số lượng sách",
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
            data: categories.bookTotals || [], // Dữ liệu về số lượng sách
          },
        ],
      };
    };

    onMounted(() => {
      if (props.categories) {
        updateChart(props.categories);
      }

      options.value = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Sách theo thể loại",
          },
        },
      };
    });

    // Theo dõi sự thay đổi của prop `categories` và cập nhật biểu đồ
    watch(
      () => props.categories,
      (newValue) => {
        if (newValue) {
          updateChart(newValue);
        }
      },
      { immediate: true, deep: true }
    );

    return {
      chartData,
      options,
    };
  },
});
</script>
<style scoped>
.categories-chart{
  height: 25rem;
  max-height: 25rem;
}
</style>