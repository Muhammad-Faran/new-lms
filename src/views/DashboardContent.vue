<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import API from '../utils/baseApi';
import { formatCurrency } from '../utils/constrants';
import Combobox from '../components/Combobox.vue';
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

const stats = ref([
  { name: 'Total Disbursed Amount', stat: 'PKR 0' },
  { name: 'Total AUM (Loans in disbursed state)', stat: 'PKR 0' },
  { name: 'Total Shippers', stat: '0' },
  { name: 'Total Active Shippers (3 Months Active)', stat: '0' },
  { name: 'Order Count', stat: '0' },
  { name: 'Total Revenue', stat: 'PKR 0' },
  { name: 'Delinquent Orders Count', stat: '0' },
  { name: 'Total Active Shippers (3 Months Active)', stat: '0' },
]);

const selectedShipper = ref(null); // Selected item from Combobox
const selectedProduct = ref(null); // Selected item from Combobox
const shipperData = ref([]);
const productData = ref([]);
const fromDate = ref(null);
const toDate = ref(null);
const loading = ref(false)

const fetchProductsData = async () => {
  try {
    const response = await axios.get(API.PRODUCTS);

    const {
      data
    } = response.data

    productData.value = [...data]

  } catch (error) {
    console.error('Error exporting transactions:', error.response || error.message);
  }
};

const fetchShipperNamesData = async () => {
  try {
    const response = await axios.get(API.APPLICANTS_SHIPPER_NAME);

    const {
      shipper_names
    } = response.data

    shipperData.value = [...shipper_names.map((item, index) => ({ id: index + 1, name: item }))]

  } catch (error) {
    console.error('Error exporting transactions:', error.response || error.message);
  }
};

const exportDashboardStats = async () => {
  try {
    loading.value = true

    const params = {
      from_date: fromDate.value,
      to_date: toDate.value,
      shipper_name: selectedShipper.value?.name,
      product_id: selectedProduct.value?.id,
    };

    const response = await axios.get(API.DASHBOARD_STATS, { params });

    const {
      total_disbursed_amount,
      total_aum,
      total_shippers,
      total_active_shippers,
      order_count,
      total_revenue,
      delinquent_orders_count,
      volume_of_delinquent_loans
    } = response.data

    stats.value = [
      { name: 'Total Disbursed Amount', stat: `PKR ${formatCurrency(parseFloat(total_disbursed_amount || 0))}` },
      { name: 'Total AUM (Loans in disbursed state)', stat: `PKR ${formatCurrency(parseFloat(total_aum || 0))}` },
      { name: 'Total Shippers', stat: total_shippers || 0 },
      { name: 'Total Active Shippers (3 Months Active)', stat: total_active_shippers || 0 },
      { name: 'Order Count', stat: order_count || 0 },
      { name: 'Total Revenue', stat: `PKR ${formatCurrency(parseFloat(total_revenue || 0))}` },
      { name: 'Delinquent Orders Count', stat: delinquent_orders_count || 0 },
      { name: 'Volume Of Delinquent Loans', stat: `PKR ${formatCurrency(parseFloat(volume_of_delinquent_loans || 0))}` },
    ];

  } catch (error) {
    console.error('Error exporting transactions:', error.response || error.message);
  } finally {
    loading.value = false
  }
};



const resetFilters = () => {
  fromDate.value = null;
  toDate.value = null;
  selectedShipper.value = null
  selectedProduct.value = null
};

watch([fromDate, toDate, selectedShipper, selectedProduct], () => {
  if (fromDate.value && toDate.value) {
    if (new Date(toDate.value) >= new Date(fromDate.value)) {
      exportDashboardStats();
    } else {
      alert('Error: "To Date" cannot be earlier than "From Date".');
    }
  } else if (!fromDate.value && !toDate.value) {
    // Allow calling API if either product or shipper is selected without dates
    if (selectedShipper.value || selectedProduct.value) {
      exportDashboardStats();
    } else {
      // If all filters reset, call API to reset stats
      exportDashboardStats();
    }
  }
});

onMounted(() => {
  exportDashboardStats()
  fetchProductsData()
  fetchShipperNamesData()
})
</script>

<template>
  <div class="px-6 py-2 min-h-screen">
    <div class="container mx-auto">
      <!-- Dashboard Title -->
      <h1 class="text-4xl font-extrabold text-black mb-4">Dashboard</h1>

      <!-- Filters Section -->
      <div
        class="hidden grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-white p-4 rounded-xl shadow-lg mb-4 z-10 relative">
        <!-- Reset Button -->
        <button @click="resetFilters"
          class="flex items-center justify-center rounded-full bg-red-200 hover:bg-red-300 text-red-700 h-10 w-10 mx-auto md:mx-0"
          aria-label="Reset Filters">
          <i class="fas fa-times"></i>
        </button>

        <!-- From Date Picker -->
        <Flatpickr v-model="fromDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="From Date"
          class="w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:ring-indigo-500" />

        <!-- To Date Picker -->
        <Flatpickr v-model="toDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="To Date"
          class="w-full rounded-lg border-gray-300 py-2 px-4 shadow-sm focus:ring-indigo-500" />

        <!-- Shipper Selection -->
        <Combobox v-model="selectedShipper" :options="shipperData" placeholder="Select Shipper"
          class="w-full rounded-lg" option-label="name" :truncate-options="false" />

        <!-- Product Selection -->
        <Combobox v-model="selectedProduct" :options="productData" placeholder="Choose Product" class="rounded-lg"
          option-label="name" :truncate-options="false" />
      </div>

      <!-- Statistics Cards -->
      <div v-loading="loading" class="relative hidden">
        <dl class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="item in stats" :key="item.name"
            class="bg-[#cdf1a6] p-4 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 duration-300">
            <dt class="text-md font-semibold text-gray-700 whitespace-normal break-words">{{ item.name }}</dt>
            <dd class="mt-2 text-2xl font-bold text-gray-900">{{ item.stat }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
