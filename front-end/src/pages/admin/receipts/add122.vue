<template>
  <div class="card w-100 max-w-4xl mx-auto">
    <div class="card-header">
      <h3 class="card-title text-2xl font-bold">Goods Receipt</h3>
    </div>
    <div class="card-body space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Receipt Number -->
        <div class="mb-3">
          <label for="receipt-number" class="form-label">Receipt Number</label>
          <input
            type="text"
            id="receipt-number"
            v-model="receiptNumber"
            class="form-control"
            placeholder="GR-001"
          />
        </div>
        <!-- Receipt Date -->
        <div class="mb-3">
          <label for="receipt-date" class="form-label">Receipt Date</label>
          <div class="relative">
            <input
              type="date"
              id="receipt-date"
              v-model="receiptDate"
              class="form-control"
            />
            <i
              class="bi bi-calendar position-absolute top-50 end-0 translate-middle-y pe-2"
            ></i>
          </div>
        </div>
        <!-- Supplier -->
        <div class="mb-3">
          <label for="supplier" class="form-label">Supplier</label>
          <select v-model="selectedSupplier" id="supplier" class="form-select">
            <option value="" disabled>Select supplier</option>
            <option
              v-for="supplier in suppliers"
              :key="supplier"
              :value="supplier"
            >
              {{ supplier }}
            </option>
          </select>
        </div>
        <!-- Warehouse -->
        <div class="mb-3">
          <label for="warehouse" class="form-label">Warehouse</label>
          <select
            v-model="selectedWarehouse"
            id="warehouse"
            class="form-select"
          >
            <option value="" disabled>Select warehouse</option>
            <option
              v-for="warehouse in warehouses"
              :key="warehouse"
              :value="warehouse"
            >
              {{ warehouse }}
            </option>
          </select>
        </div>
      </div>

      <!-- Items Table -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Received Items</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.name"
                  placeholder="Enter item name"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="item.quantity"
                  min="0"
                />
              </td>
              <td>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="item.unitPrice"
                  min="0"
                  step="0.01"
                />
              </td>
              <td>\${{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
              <td>
                <button
                  @click="removeItem(item.id)"
                  class="btn btn-danger btn-sm"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="addItem" class="btn btn-outline-primary btn-sm mt-2">
          <i class="bi bi-plus-lg me-2"></i>Add Item
        </button>
      </div>

      <!-- Notes -->
      <div class="mb-3">
        <label for="notes" class="form-label">Notes</label>
        <textarea
          id="notes"
          v-model="notes"
          class="form-control"
          placeholder="Enter any additional notes"
        ></textarea>
      </div>

      <!-- Total Amount -->
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h4 class="font-semibold">Total Amount:</h4>
          <p class="text-2xl font-bold">\${{ totalAmount.toFixed(2) }}</p>
        </div>
        <div class="mb-3">
          <label for="received-by" class="form-label">Received By</label>
          <input
            type="text"
            id="received-by"
            v-model="receivedBy"
            class="form-control"
            placeholder="Enter name"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer d-flex justify-content-between">
      <button class="btn btn-outline-secondary">Cancel</button>
      <div class="space-x-2">
        <button class="btn btn-outline-primary">
          <i class="bi bi-printer me-2"></i> Print
        </button>
        <button class="btn btn-primary">
          <i class="bi bi-save me-2"></i> Save Receipt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const receiptNumber = ref("");
const receiptDate = ref("");
const selectedSupplier = ref("");
const selectedWarehouse = ref("");
const notes = ref("");
const receivedBy = ref("");

const suppliers = ["Supplier A", "Supplier B", "Supplier C"];
const warehouses = ["Warehouse 1", "Warehouse 2", "Warehouse 3"];

const items = ref([
  { id: 1, name: "Widget A", quantity: 100, unitPrice: 1.99 },
  { id: 2, name: "Gadget B", quantity: 50, unitPrice: 4.99 },
]);

const addItem = () => {
  const newId =
    items.value.length > 0
      ? Math.max(...items.value.map((item) => item.id)) + 1
      : 1;
  items.value.push({ id: newId, name: "", quantity: 0, unitPrice: 0 });
};

const removeItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id);
};

const totalAmount = computed(() => {
  return items.value.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
