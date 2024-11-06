<template>
  <div>
    <a-layout-content style="margin: 0 16px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Tồn kho</a-breadcrumb-item>
        <a-breadcrumb-item class="fw-bold">Danh sách</a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-card>
          <template #title>
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">Thống kê doanh thu</h2>
              <div class="flex gap-4 items-center">
                <!-- Filter Type Select -->
                <a-select
                  v-model:value="filterType"
                  style="width: 120px"
                  @change="handleFilterChange"
                >
                  <a-select-option value="day">Theo ngày</a-select-option>
                  <a-select-option value="month">Theo tháng</a-select-option>
                </a-select>

                <!-- Date Range Picker for Day Filter -->
                <div
                  v-if="filterType === 'day'"
                  class="flex gap-2 items-center"
                >
                  <a-range-picker
                    v-model:value="dateRange"
                    format="DD/MM/YYYY"
                    :disabled-date="disabledDate"
                    @change="handleDateRangeChange"
                  />
                </div>

                <!-- Month Range Picker for Month Filter -->
                <div
                  v-if="filterType === 'month'"
                  class="flex gap-2 items-center"
                >
                  <a-range-picker
                    v-model:value="monthRange"
                    :picker="'month'"
                    format="MM/YYYY"
                    :disabled-date="disabledDate"
                    @change="handleMonthRangeChange"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Loading State -->
          <a-spin :spinning="loading">
            <!-- Chart Section -->
            <div ref="chartContainer" style="width: 100%; height: 400px"></div>

            <!-- Statistics Cards -->
            <div class="grid grid-cols-3 gap-4 mt-4">
              <a-card class="bg-blue-50">
                <template #title>
                  <span class="text-blue-600">Tổng doanh thu</span>
                </template>
                <p class="text-2xl font-bold">
                  {{
                    formatCurrency(
                      statistics.totalRevenue ? statistics.totalRevenue : 0
                    )
                  }}
                </p>
              </a-card>

              <a-card class="bg-green-50">
                <template #title>
                  <span class="text-green-600">Trung bình</span>
                </template>
                <p class="text-2xl font-bold">
                  {{
                    formatCurrency(
                      statistics.avgRevenue ? statistics.avgRevenue : 0
                    )
                  }}
                </p>
              </a-card>

              <a-card class="bg-purple-50">
                <template #title>
                  <span class="text-purple-600">Cao nhất</span>
                </template>
                <p class="text-2xl font-bold">
                  {{
                    formatCurrency(
                      statistics.maxRevenue ? statistics.maxRevenue : 0
                    )
                  }}
                </p>
              </a-card>
            </div>
          </a-spin>
        </a-card>
      </div>
    </a-layout-content>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import ApiAdminService from "@/service/admin/apiAdmin.service";
import { buttons, language } from "@/utils/datatable";

// Data
const filterType = ref("day");
const chartContainer = ref(null);
const loading = ref(false);
let chart = null;
const apiAdmin = new ApiAdminService();
// Date ranges
const dateRange = ref([]);
const monthRange = ref([]);

// Chart data
const statistics = ref({});

// API call function
const fetchRevenueData = async () => {
  loading.value = true;
  try {
    let params = {
      type: filterType.value,
      startDate: null,
      endDate: null,
    };

    // Format dates based on filter type
    switch (filterType.value) {
      case "day":
        if (dateRange.value?.length === 2) {
          params.startDate = dateRange.value[0].format("DD/MM/YYYY");
          params.endDate = dateRange.value[1].format("DD/MM/YYYY");
        }
        break;
      case "month":
        if (monthRange.value?.length === 2) {
          params.startDate = monthRange.value[0]
            .startOf("month")
            .format("DD/MM/YYYY");
          params.endDate = monthRange.value[1]
            .endOf("month")
            .format("DD/MM/YYYY");
        }
        break;
    }

    // Make API call
    const response = await apiAdmin.post("/statistics/revenue", params);
    if (response.status === 200) {
        statistics.value = response.data;
    }
  } catch (error) {
    message.error("Có lỗi xảy ra khi tải dữ liệu");
    console.error("Error fetching revenue data:", error);
  } finally {
    loading.value = false;
  }
};

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const disabledDate = (current) => {
  return current && current > dayjs().endOf("day");
};

const handleFilterChange = (value) => {
  filterType.value = value;
  resetDateRanges();
};

const resetDateRanges = () => {
  dateRange.value = [];
  monthRange.value = [];
};

const handleDateRangeChange = async () => {
  await fetchRevenueData();
  updateChart();
};

const handleMonthRangeChange = async () => {
  await fetchRevenueData();
  updateChart();
};

const initChart = () => {
  if (chart) {
    chart.dispose();
  }

  chart = echarts.init(chartContainer.value);
  updateChart();
};

const updateChart = () => {
  const option = {
    tooltip: {
      show: true,
      trigger: "axis",
      formatter: function (params) {
        return `${params[0].name}<br/>
                Doanh thu: ${formatCurrency(params[0].value)}<br/>
                Tổng số đơn hàng: ${params[1].value}<br/>
                Tổng số sách bán ra: ${params[2].value}<br/>
                Trung bình doanh thu: ${formatCurrency(params[3].value)}<br/>
                Doanh thu cao nhất: ${formatCurrency(params[4].value)}`;
      },
    },

    legend: {
      data: [
        "Doanh thu",
        "Tổng số đơn hàng",
        "Tổng số sách bán ra",
        "Trung bình doanh thu",
        "Doanh thu cao nhất",
      ],
      textStyle: {
        color: "#333", // Màu chữ cho chú thích
      },
    },
    xAxis: {
      type: "category",
      data:  statistics.value?.stats?.map((item) => item._id),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Giá",
        axisLabel: {
          formatter: (value) => {
            return formatCurrency(value);
          },
        },
      },
      {
        type: "value",
        name: "Số lượng",
        axisLabel: {
          formatter: (value) => {
            return value;
          },
        },
        position: "right",
      },
    ],
    series: [
      {
        name: "Doanh thu",
        data:  statistics.value?.stats?.map((item) => item.totalRevenue),
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#8884d8", // Màu cho doanh thu
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(136,132,216,0.3)" },
            { offset: 1, color: "rgba(136,132,216,0.1)" },
          ]),
        },
        yAxisIndex: 0,
      },
      {
        name: "Tổng số đơn hàng",
        data:  statistics.value?.stats?.map((item) => item.totalOrders),
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#82ca9d", // Màu cho tổng số đơn hàng
        },
        yAxisIndex: 1,
      },
      {
        name: "Tổng số sách bán ra",
        data:  statistics.value?.stats?.map((item) => item.totalBooksSold),
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#ffc658", // Màu cho tổng số sách bán ra
        },
        yAxisIndex: 1,
      },
      {
        name: "Trung bình doanh thu",
        data:  statistics.value?.stats?.map((item) => item.avgRevenue),
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#000", // Màu cho trung bình doanh thu
        },
        yAxisIndex: 0,
      },
      {
        name: "Doanh thu cao nhất",
        data:  statistics.value?.stats?.map((item) => item.maxRevenue),
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#ff0000", // Màu cho doanh thu cao nhất
        },
        yAxisIndex: 0,
      },
    ],
  };

  chart.setOption(option);
};

// Lifecycle Hooks
onMounted(() => {
  initChart();
  window.addEventListener("resize", () => {
    chart && chart.resize();
  });
});
</script>

<style scoped>
.grid {
  display: grid;
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.gap-4 {
  gap: 1rem;
}
.mt-4 {
  margin-top: 1rem;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.font-bold {
  font-weight: 700;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-2 {
  gap: 0.5rem;
}
</style>
