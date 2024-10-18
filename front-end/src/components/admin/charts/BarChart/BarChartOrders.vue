<template>
  <BarChartComponent
    v-if="chartData && options && chartData.datasets.length"
    :data="chartData"
    :options="options"
    class="orders-chart"
  />
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
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
  props: {
    orders: {
      type: Object,
      default: () => ({}), // Đảm bảo luôn có một đối tượng mặc định
    },
  },
  setup(props) {
    const chartData = ref(null);
    const options = ref(null);

    const updateChartData = (orders) => {
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
            label: "Đơn hàng",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            data: orders.ordersByMonth || [], // Đảm bảo dữ liệu không null
          },
        ],
      };
    };

    watch(
      () => props.orders,
      (newOrders) => {
        if (newOrders && newOrders.ordersByMonth) {
          updateChartData(newOrders);
        }
      },
      { immediate: true, deep: true }
    );

    onMounted(() => {
      if (props.orders && props.orders.ordersByMonth) {
        updateChartData(props.orders);
      }

      options.value = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: "Đơn hàng theo tháng",
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
.orders-chart{
  height: 30rem;
  max-height: 30rem;
}
</style>
