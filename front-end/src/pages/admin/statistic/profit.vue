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
              <h2 class="text-lg font-semibold">Thống kê lợi nhuận</h2>
              <div class="flex gap-4 items-center">
                <a-auto-complete
                  v-model:value="selectedBook"
                  :options="filteredOptions"
                  style="width: 200px"
                  placeholder="Sản phẩm -> lợi nhuận"
                  :allow-clear="true"
                  @select="onSelect"
                  @search="onSearch"
                >
                  <template #clearIcon>
                    <close-outlined />
                  </template>
                </a-auto-complete>
                <!-- Month Range Picker for Month Filter -->
                <div class="flex gap-2 items-center">
                  <a-range-picker
                    v-model:value="monthRange"
                    :picker="'month'"
                    format="MM/YYYY"
                    :disabled-date="disabledDate"
                  />
                </div>
                <div>
                  <button
                    @click="handleStatistic"
                    class="btn btn-sm btn-primary"
                  >
                    Thống kê
                  </button>
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
                  <span class="text-blue-600">Tổng lợi nhuận</span>
                </template>
                <p class="text-2xl font-bold">
                  {{
                    formatCurrency(
                      statistics.totalProfit ? statistics.totalProfit : 0
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
                      statistics.avgProfit ? statistics.avgProfit : 0
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
                      statistics.maxProfit ? statistics.maxProfit : 0
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
import {showErrorToast} from "@/utils/toast.util"

// Data
const chartContainer = ref(null);
const loading = ref(false);
let chart = null;
const apiAdmin = new ApiAdminService();
// Date ranges
const monthRange = ref([]);

// Chart data
const statistics = ref({});
const options = ref([]); // Toàn bộ danh sách sách từ API
const filteredOptions = ref([]); // Danh sách tìm kiếm
const selectedBook = ref(""); // Giá trị sách được chọn
// API call function
const fetchProfitData = async () => {
  loading.value = true;
  try {
    let params = {
      startDate: null,
      endDate: null,
    };

    // Format dates based on filter type

    if (monthRange.value?.length === 2) {
      params.startDate = monthRange.value[0]
        .startOf("month")
        .format("DD/MM/YYYY");
      params.endDate = monthRange.value[1].endOf("month").format("DD/MM/YYYY");
    }

    // Gửi ID sách nếu có
    const book = options.value.find(
      (option) => option.label === selectedBook.value
    );
    if (book) {
      params.bookID = book.value;
      console.log(params.bookID);
    }

    // Make API call
    const response = await apiAdmin.post("/statistics/profit", params);
    if (response.status === 200) {
      statistics.value = response.data;
      console.log(statistics.value);
    }
  } catch (error) {
    message.error("Có lỗi xảy ra khi tải dữ liệu");
    console.error("Error fetching revenue data:", error);
  } finally {
    loading.value = false;
  }
};

const handleStatistic = async () => {
  if (!monthRange.value?.length) {
    showErrorToast("Vui lòng chọn khoảng thời gian trước khi thống kê.");
    return;
  }

  await fetchProfitData();
  updateChart();
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
        const monthData = statistics.value?.data?.find(
          (item) => item.time === params[0].name
        );

        return `
          Tháng: ${params[0].name}<br/>
          Tổng doanh thu: ${formatCurrency(monthData?.totalRevenue || 0)}<br/>
          Tổng giá vốn: ${formatCurrency(monthData?.totalCost || 0)}<br/>
          Tổng lợi nhuận: ${formatCurrency(monthData?.totalProfit || 0)}<br/>
        `;
      },
    },

    legend: {
      data: ["Tổng doanh thu", "Tổng giá vốn", "Tổng lợi nhuận"],
      textStyle: {
        color: "#333", // Màu chữ
      },
    },

    xAxis: {
      type: "category",
      data: statistics.value?.data?.map((item) => item.time),
      axisLabel: {
        rotate: 45,
      },
    },

    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => formatCurrency(value),
      },
    },

    series: [
      {
        name: "Tổng doanh thu",
        data: statistics.value?.data?.map((item) => item.totalRevenue),
        type: "bar",
        itemStyle: {
          color: "#8884d8",
        },
      },
      {
        name: "Tổng giá vốn",
        data: statistics.value?.data?.map((item) => item.totalCost),
        type: "bar",
        itemStyle: {
          color: "#82ca9d",
        },
      },
      {
        name: "Tổng lợi nhuận",
        data: statistics.value?.data?.map((item) => item.totalProfit),
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#ff7300",
        },
      },
    ],
  };

  chart.setOption(option);
};

// Lifecycle Hooks
onMounted(() => {
  getBooks();
  initChart();
  window.addEventListener("resize", () => {
    chart && chart.resize();
  });
  filteredOptions.value = options.value;
});

const getBooks = async () => {
  const response = await apiAdmin.get("/books");
  if (response.status === 200) {
    options.value = response.data.map((book) => ({
      value: book._id,
      label: book.name,
    }));
    filteredOptions.value = options.value;
  }
};
// Hàm tìm kiếm
const onSearch = (searchText) => {
  if (!searchText) {
    filteredOptions.value = options.value;
  } else {
    filteredOptions.value = options.value.filter((option) =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }
};

// Hàm khi chọn một sách
const onSelect = (selectedValue) => {
  const book = options.value.find((option) => option.value === selectedValue);
  if (selectedBook) {
    selectedBook.value = book.label;
    filteredOptions.value = [];
  }
};
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
