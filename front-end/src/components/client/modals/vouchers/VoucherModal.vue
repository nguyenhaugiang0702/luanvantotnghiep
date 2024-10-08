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
                  <h6 class="mb-1">{{ voucher.code }}</h6>
                  <div
                    v-if="
                      voucher.voucherID?.voucherCategoryID?.discountType ===
                      'percent'
                    "
                  >
                    <p class="mb-1 text-muted">
                      Giảm {{ voucher.voucherID?.voucherCategoryID?.value }}%
                    </p>
                  </div>
                  <div v-else>
                    <p class="mb-1 text-muted">
                      Giảm
                      {{
                        formatPrice(voucher.voucherID?.voucherCategoryID?.value)
                      }}
                    </p>
                  </div>
                  <small class="text-muted"
                    >Đơn tối thiểu
                    {{
                      formatPrice(
                        voucher.voucherID?.voucherCategoryID?.minValue
                      )
                    }}</small
                  >
                </div>
                <button
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

const emit = defineEmits(["refreshCart:update"]);
const voucherUseds = ref([]);
const apiUser = new ApiUser();
const token = Cookies.get("accessToken");
const getVouchersUseds = async () => {
  const response = await apiUser.get("/vouchers/voucherUseds", token);
  if (response.status === 200) {
    voucherUseds.value = response.data;
  }
};

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
      toast(response.data.message, {
        theme: "auto",
        type: "success",
        dangerouslyHTMLString: true,
      });
      getVouchersUseds();
    }
  } catch (error) {
    toast(error.response?.data?.message, {
      theme: "auto",
      type: "error",
      dangerouslyHTMLString: true,
    });
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
