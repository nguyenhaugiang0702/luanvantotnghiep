<template>
  <button
    class="btn btn-outline-primary"
    data-bs-toggle="modal"
    data-bs-target="#voucherModal"
  >
    <i class="fas fa-ticket-alt me-2"></i>
    Chọn Voucher
  </button>
  <div
    class="modal fade"
    id="voucherModal"
    tabindex="-1"
    aria-labelledby="voucherModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="voucherModalLabel">Chọn Voucher</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="voucherCode"
                placeholder="Nhập mã voucher"
              />
              <button class="btn btn-primary" @click="applyVoucherCode">
                Áp dụng
              </button>
            </div>
          </div>
          <div class="voucher-list">
            <div
              v-for="voucher in voucherUseds"
              :key="voucher._id"
              class="voucher-item p-3 border rounded mb-3"
              :class="{ 'border-primary': voucher.isApplied }"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6>{{ voucher.voucherID.code }}</h6>
                  <div
                    v-if="
                      voucher.voucherID?.voucherCategoryID?.discountType ===
                      'percent'
                    "
                  >
                    <div>
                      Giảm {{ voucher.voucherID?.voucherCategoryID?.value }}%
                    </div>
                  </div>
                  <div v-else>
                    <div>
                      Giảm
                      {{
                        formatPrice(voucher.voucherID?.voucherCategoryID?.value)
                      }}
                    </div>
                  </div>
                  <div>
                    Đơn tối thiểu
                    {{
                      formatPrice(
                        voucher.voucherID?.voucherCategoryID?.minValue
                      )
                    }}
                    <span
                      v-if="
                        voucher.voucherID?.voucherCategoryID?.discountType ===
                        'percent'
                      "
                    >
                      - Giảm tối đa
                      {{
                        formatPrice(
                          voucher.voucherID?.voucherCategoryID?.maxValue
                        )
                      }}</span
                    >
                  </div>
                  <div>
                    Thời hạn sử dụng đến -
                    {{ formatDate(voucher.voucherID?.endDate, (time = false)) }}
                  </div>
                  <div>
                    <div class="mx-auto">Đã sử dụng</div>
                    <a-progress
                      class="process"
                      :stroke-color="{
                        from: '#2563eb',
                        to: '#1e40af',
                      }"
                      :percent="voucher.voucherID.usedPercentage"
                    />
                  </div>
                </div>
                <button
                  class="btn btn-sm btn-secondary"
                  v-if="voucher.voucherID.usedPercentage === 100"
                >
                  Đã hết mã
                </button>
                <button
                  v-else
                  class="btn btn-sm"
                  :class="
                    voucher.isApplied ? 'btn-secondary' : 'btn-outline-primary'
                  "
                  @click="toggleVoucher(voucher)"
                >
                  {{ voucher.isApplied ? "Bỏ chọn" : "Chọn" }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmVoucher"
            data-bs-dismiss="modal"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, inject, watch, defineEmits } from "vue";
import ApiUser from "@/service/user/apiUser.service";
import { formatPrice, handleNavigate } from "@/utils/utils";
import { toast } from "vue3-toastify";
import Cookies from "js-cookie";
import { showSuccessToast, showErrorToast } from "@/utils/toast.util";
import { formatDate } from "@/utils/utils";
const emit = defineEmits(["refreshCart:update"]);
const voucherUseds = ref([]);
const apiUser = new ApiUser();
const token = Cookies.get("accessToken");
const updateVouchers = inject("updateVouchers");
const getVouchersUseds = async () => {
  const response = await apiUser.get("/vouchers/voucherUseds");
  if (response.status === 200) {
    voucherUseds.value = response.data.vouchers;
  }
};

watch(updateVouchers, (newValue) => {
  if (newValue) {
    getVouchersUseds();
  }
});

const toggleVoucher = async (voucherUsed) => {
  let response;
  try {
    if (voucherUsed.isApplied) {
      response = await apiUser.put(
        `/vouchers/voucherUseds/${voucherUsed._id}`,
        {
          isApplied: false,
          method: "UNSELECT",
          voucherID: voucherUsed.voucherID?._id,
        }
      );
    } else {
      response = await apiUser.put(
        `/vouchers/voucherUseds/${voucherUsed._id}`,
        {
          isApplied: true,
          method: "SELECT",
          voucherID: voucherUsed.voucherID?._id,
        }
      );
    }
    if (response.status === 200) {
      showSuccessToast(response?.data?.message);
      await getVouchersUseds();
    }
  } catch (error) {
    console.log(error);
    showErrorToast(error.response?.data?.message);
  }
};

onMounted(async () => {
  await getVouchersUseds();
});

watch(
  voucherUseds,
  (newValue) => {
    emit("refreshCart:update", newValue);
  },
  { deep: true }
);
</script>
<style scoped>
.voucher-list {
  height: 30rem;
  max-height: 30rem;
  overflow: auto;
}
</style>
