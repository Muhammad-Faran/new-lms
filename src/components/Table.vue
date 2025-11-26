<template>
    <div
        class="relative mt-8 sm:mx-0 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-sm shadow-slate-200">
        <!-- Search Section -->
        <div class="sm:col-span-4 flex items-center justify-between p-4">
            <!-- Search Box -->
            <input id="search" name="search" type="text" v-model="searchQuery" @input="handleSearch"
                placeholder="Search..."
                class="block w-60 sm:w-2/6 rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-800 shadow-inner shadow-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 sm:text-sm transition-colors" />

            <!-- Conditional Filters Section -->
            <!-- Filter Section -->
            <div v-if="showFilters" class="flex items-center space-x-2">
                <!-- From Date -->
                <Flatpickr v-model="fromDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="From Date"
                    class="block w-36 rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-800 shadow-inner shadow-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 sm:text-sm" />
                <!-- To Date -->
                <Flatpickr v-model="toDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="To Date"
                    class="block w-36 rounded-lg border border-slate-200 bg-white py-2 px-3 text-slate-800 shadow-inner shadow-slate-200 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 sm:text-sm" />

                <!-- Reset Filters Button -->
                <button @click="resetFilters"
                    class="p-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 focus:ring-2 focus:ring-emerald-300/50"
                    aria-label="Reset Filters">
                    <i class="fas fa-times text-sm"></i>
                </button>

            </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto overflow-y-visible z-10">
            <table v-loading="loading"
                class="z-10 p-2 px-4 min-w-full divide-y divide-slate-200 mt-4 bg-white/60 rounded-xl shadow-inner shadow-slate-100">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.Header"
                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                            {{ column.Header }}
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white/70">
                    <tr v-for="row in data" :key="row.id">
                        <td v-for="column in columns" :key="column.accessor"
                            class="px-3 py-4 text-sm text-slate-700 whitespace-nowrap">
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
        <div class="p-2 mx-4 mt-4 flex flex-col sm:flex-row gap-y-2 items-center justify-end text-slate-600">
            <div class="mr-2 items-start text-center text-sm">
                Showing {{ pageCount }} Records out of {{ recordCount }}
            </div>
            <div class="mr-2">
                <select v-model="pageSize"
                    class="w-full pr-10 py-1 justify-between rounded-lg border border-slate-800 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/60">
                    <option v-for="size in pageOptions" :key="size" :value="size">
                        {{ size }}
                    </option>
                </select>
            </div>
            <el-pagination class="el-pagination--dark" :current-page="currentPage" :page-size="pageSize"
                :total="recordCount" layout="prev, pager, next" @current-change="handlePageChange" />
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

<style scoped>
:deep(.el-pagination.el-pagination--dark) {
    --el-pagination-hover-color: #10b981;
    --el-text-color-primary: #e2e8f0;
    --el-border-color-lighter: #1f2937;
    --el-border-color: #111827;
    --el-text-color-placeholder: #9ca3af;
}

:deep(.el-pagination.el-pagination--dark button) {
    background-color: #0f172a;
    color: #e2e8f0;
    border: 1px solid #1f2937;
    border-radius: 0.5rem;
}

:deep(.el-pagination.el-pagination--dark button:hover:not(:disabled)) {
    color: #10b981;
    border-color: #10b981;
    background-color: #111827;
}

:deep(.el-pagination.el-pagination--dark .el-pager li) {
    background-color: #0f172a;
    color: #e2e8f0;
    border: 1px solid #1f2937;
    border-radius: 0.75rem;
    margin: 0 0.15rem;
}

:deep(.el-pagination.el-pagination--dark .el-pager li:hover) {
    color: #10b981;
    border-color: #10b981;
    background-color: #111827;
}

:deep(.el-pagination.el-pagination--dark .el-pager li.is-active) {
    color: #e2e8f0;
    border-color: #334155;
    background: linear-gradient(135deg, #111827, #0f172a);
    box-shadow: 0 6px 18px -8px #0b1120;
}

:deep(.el-pagination.el-pagination--dark .btn-prev.is-disabled),
:deep(.el-pagination.el-pagination--dark .btn-next.is-disabled) {
    color: #64748b;
    border-color: #1f2937;
    background-color: #0b1120;
}
</style>
