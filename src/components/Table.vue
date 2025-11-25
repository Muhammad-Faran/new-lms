<template>
    <div class="relative mt-8 sm:mx-0 bg-white border shadow-md rounded-md">
        <!-- Search Section -->
        <div class="sm:col-span-4 flex items-center justify-between p-4">
            <!-- Search Box -->
            <input id="search" name="search" type="text" v-model="searchQuery" @input="handleSearch"
                placeholder="Search..."
                class="block w-60 sm:w-2/6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6" />

            <!-- Conditional Filters Section -->
            <!-- Filter Section -->
            <div v-if="showFilters" class="flex items-center space-x-2">
                <!-- From Date -->
                <Flatpickr v-model="fromDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="From Date"
                    class="block w-36 rounded-md border-gray-300 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                <!-- To Date -->
                <Flatpickr v-model="toDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="To Date"
                    class="block w-36 rounded-md border-gray-300 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm" />

                <!-- Reset Filters Button -->
                <button @click="resetFilters"
                    class="p-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-gray-300 text-black hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                    aria-label="Reset Filters">
                    <i class="fas fa-times text-sm"></i>
                </button>

            </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto z-10">
            <table v-loading="loading" class="z-10 p-2 px-4 min-w-full divide-y divide-gray-300 mt-4">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.Header"
                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {{ column.Header }}
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="row in data" :key="row.id">
                        <td v-for="column in columns" :key="column.accessor"
                            class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                            <!-- Slot for Custom Content -->
                            <slot v-if="column.slotName" :name="column.slotName" :value="row"></slot>
                            <!-- Default Content -->
                            <span v-else>{{ row[column.accessor] }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Section -->
        <div class="p-2 mx-4 mt-4 flex flex-col sm:flex-row gap-y-2 items-center justify-end">
            <div class="mr-2 items-start text-center">
                Showing {{ pageCount }} Records out of {{ recordCount }}
            </div>
            <div class="mr-2">
                <select v-model="pageSize"
                    class="w-full pr-10 py-2 justify-between border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300">
                    <option v-for="size in pageOptions" :key="size" :value="size">
                        {{ size }}
                    </option>
                </select>
            </div>
            <el-pagination :current-page="currentPage" :page-size="pageSize" :total="recordCount"
                layout="prev, pager, next" @current-change="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue';
import { ElPagination } from 'element-plus';
import 'element-plus/dist/index.css';
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
    columns: Array,
    data: Array,
    action: Array,
    fetchData: Function,
    loading: Boolean,
    isReFetch: Boolean,
    pageCount: Number,
    currentPageIndex: Number,
    recordCount: Number,
    pageType: String,
    showFilters: { type: Boolean, default: false }, // Toggle for filters
    onEdit: Function,
    onDelete: Function,
    onPermissions: Function, // Add prop for handling permissions
    exportFilter: Function, // Add prop for handling permissions
});

const fromDate = ref(null);
const toDate = ref(null);
const pageSize = ref(20);
const searchQuery = ref('');
const currentPage = ref(
    route.path === '/dashboard/borrowers'
        ? parseInt(localStorage.getItem('page_index')) || "1"
        : 1
);
const debouncedSearchQuery = ref(''); // Debounced value for search query
let debounceTimeout = null;
const pageOptions = [10, 20, 50];

// Convert props to refs so they are reactive
const { isReFetch } = toRefs(props);

// Watch isReFetch and call fetchData when it changes
watch(isReFetch, (newValue) => {
    props.fetchData({
        pageIndex: currentPage.value - 1,
        pageSize: pageSize.value,
        search: debouncedSearchQuery.value,
    });
});

watch([currentPage, pageSize, debouncedSearchQuery], () => {
    props.fetchData({
        pageIndex: currentPage.value - 1,
        pageSize: pageSize.value,
        search: debouncedSearchQuery.value,
    });

    props.exportFilter({ newFromDate: fromDate, newToDate: toDate, searchQuery: debouncedSearchQuery.value })
});

watch([fromDate, toDate], ([newFromDate, newToDate]) => {
    if (newFromDate && newToDate) {
        if (new Date(newFromDate) > new Date(newToDate)) {
            // Reset the invalid dates and notify the user
            fromDate.value = null;
            toDate.value = null;
            alert("From Date cannot be greater than To Date.");
            return;
        }

        props.exportFilter({ newFromDate, newToDate, searchQuery: debouncedSearchQuery.value })

        // Trigger API call if dates are valid
        props.fetchData({
            pageIndex: currentPage.value - 1,
            pageSize: pageSize.value,
            search: debouncedSearchQuery.value,
            from_date: newFromDate,
            to_date: newToDate,
        });
    }
});

const applyFilters = () => {
    props.fetchData({
        pageIndex: currentPage.value - 1,
        pageSize: pageSize.value,
        search: debouncedSearchQuery.value,
        from_date: fromDate.value,
        to_date: toDate.value,
    });
};

const resetFilters = () => {
    fromDate.value = null;
    toDate.value = null;
    debouncedSearchQuery.value = ''
    searchQuery.value = ''
    applyFilters(); // Reload data without filters
};

const handleSearch = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        debouncedSearchQuery.value = searchQuery.value;
    }, 500);
};

const handlePageChange = (page) => {
    currentPage.value = page;
    localStorage.setItem('page_index', page);
};
</script>
