<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import Table from '../../components/Table.vue';
import API from '../../utils/baseApi';
import { fromUtc } from '../../utils/datetime';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import Flatpickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

const open = ref(false)
const viewTransition = ref(false)

const showModal = ref(false);
const modalImage = ref(null);

const openImageModal = (imageUrl) => {
    modalImage.value = imageUrl;
    showModal.value = true;
};


const router = useRouter();

const columns = [
    { Header: 'Transaction Id', accessor: 'id' },
    { Header: 'Borrower', accessor: 'borrower', slotName: "borrower" },
    { Header: 'Shipper', accessor: 'borrower', slotName: "shipperName" },
    { Header: 'Product', accessor: 'product', slotName: "productName" },
    { Header: 'Order Number', accessor: 'order_number', },
    { Header: 'Financing Amount', accessor: 'loan_amount' },
    { Header: 'Due Date', accessor: 'next_due_date', slotName: "nextDueDate" },
    { Header: 'Disbursement Date', accessor: 'created_at', slotName: "createdAt" },
    { Header: 'Days Overdue', accessor: 'days_overdue' },
    { Header: 'Action', accessor: 'actions', slotName: "actions" },
]

const printerData = ref([])
const loading = ref(false)
const isReFetch = ref(false)
const pageCount = ref(0)
const recordCount = ref(0)
const productData = ref([])
const statuses = ref(['disbursed', 'completed', 'review', 'approve', 'reject', 'cancelled', 'reversed', 'hold'])
const selectedDate = ref(null);
const selectedProduct = ref('')
const selectedStatus = ref('');

watch([selectedDate, selectedProduct, selectedStatus], () => {
    isReFetch.value = !isReFetch.value
});

const resetFilters = () => {
    selectedProduct.value = ''
    selectedDate.value = null
    selectedStatus.value = ''
};

const isShowPreview = ref(false)
const selectedRowData = ref(null);

const tabs = ref([
    { name: 'Borrower', current: true },
    // { name: 'Charges', current: false },
    // { name: 'Transactions', current: false },
]);

const tabsTransactions = ref([
    { name: 'Transactions', current: true },
    { name: 'Charges', current: false },
    { name: 'Installments', current: false },
]);

const currentTab = ref('Borrower');

const changeTab = (tabName) => {
    currentTab.value = tabName;
};

const currentTabTransactions = ref('Transactions');

const changeTabTransactions = (tabName) => {
    currentTabTransactions.value = tabName;
};


const fetchPrinterData = async ({ pageIndex = 0, pageSize = 10, search = '', from_date = null, to_date = null }) => {
    loading.value = true;

    try {
        const dropdownFilters = {};

        if (selectedStatus.value) {
            dropdownFilters["transactions.status"] = selectedStatus.value;
        }
        if (selectedProduct.value) {
            dropdownFilters["transactions.product_id"] = selectedProduct.value;
        }
        if (selectedDate.value) {
            dropdownFilters["due_date"] = selectedDate.value;
        }

        const params = {
            pagination: true,
            page: pageIndex + 1, // Convert 0-based index to 1-based
            per_page: pageSize,
            search: search.trim(), // Trim whitespace from the search query
            sort_field: "transactions.id",
            sort_order: "ASC",
            from_date: from_date, // Pass from_date
            to_date: to_date,     // Pass to_date
            dropdown_filters: JSON.stringify(dropdownFilters) // Convert to JSON string
        };

        const response = await axios.get(API.OVERDUE_LOANS, { params });

        const { data, meta } = response.data;

        if (data) {
            printerData.value = data;
            pageCount.value = data.length || 0;
            recordCount.value = meta?.total || 0;
        } else {
            console.warn('No data found in API response:', response.data);
        }
    } catch (error) {
        console.error('Error fetching printer data:', error?.response?.data || error.message);
    } finally {
        loading.value = false;
    }
};

const tableRef = ref(null); // Reference to the Table component

const exportTransactions = async () => {
    try {
        const dropdownFilters = {};

        if (selectedStatus.value) {
            dropdownFilters["transactions.status"] = selectedStatus.value;
        }
        if (selectedProduct.value) {
            dropdownFilters["transactions.product_id"] = selectedProduct.value;
        }
        if (selectedDate.value) {
            dropdownFilters["due_date"] = selectedDate.value;
        }

        const params = {
            search: tableRef.value?.searchQuery || '', // Access the searchQuery from the Table component
            from_date: tableRef.value?.fromDate || null, // Access fromDate from the Table component
            to_date: tableRef.value?.toDate || null,// Access toDate from the Table component
            dropdown_filters: JSON.stringify(dropdownFilters) // Convert to JSON string
        };

        const response = await axios.get(API.EXPORT_DELINQUENT_TRANSACTIONS, {
            params,
            responseType: 'blob', // To handle file download
        });

        // Trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'overdue_transactions.xlsx'); // File name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting transactions:', error.response || error.message);
    }
};

const getExportValues = ({ newFromDate, newToDate, searchQuery }) => {
    tableRef.value = {
        searchQuery: searchQuery,
        fromDate: newFromDate,
        toDate: newToDate,
    }
}

const handleAction = (action, row) => {
    if (action === 'Edit') {
        console.log('Edit action on:', row);
        // handleEdit(row);
    }
}

const handleView = async (row) => {
    selectedRowData.value = { ...row }
    viewTransition.value = true
}

const handleEdit = async (row) => {
    router.push({
        name: 'EditBorrowers',
        params: { id: row.id },
    });
}

const handleShowModal = (row) => {
    selectedRowData.value = { ...row }
    open.value = true
}

const statusColor = {
    review: 'bg-blue-300',        // Indicates a process under evaluation, neutral but active
    approve: 'bg-teal-300',      // Indicates success or a positive outcome
    reject: 'bg-red-300',         // Indicates a failure or a negative outcome
    disbursed: 'bg-green-300',     // Indicates financial movement, calm and trustworthy
    completed: 'bg-purple-300',   // Indicates finality and resolution
    cancelled: 'bg-gray-300',     // Neutral and subdued to indicate inactivity
    reversed: 'bg-yellow-300',    // Cautionary, indicating something undone or reversed
    hold: 'bg-orange-300',        // Attention-grabbing, indicates a pause or pending status
};

const getProductData = async () => {
    try {
        const response = await axios.get(API.PRODUCTS, {});

        const { data } = response.data;

        console.log(data, "data_getProductData")

        productData.value = [...data]
    } catch (error) {
        console.error('Error fetching printer data:', error?.response?.data || error.message);
    } finally {
        loading.value = false;
    }
};


onMounted(() => {
    fetchPrinterData({ pageIndex: 0, pageSize: 10 })
    getProductData()
})
</script>

<template>
    <div class="px-2 sm:px-2 lg:px-4">
        <div>
            <div class="sm:flex sm:items-center justify-between">
                <div>
                    <h1 class="text-base font-semibold text-gray-900">Transactions</h1>
                    <p class="mt-2 text-sm text-gray-700">A list of all Delinquent transactions and borrowers information.</p>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Reset Filters Button -->
                    <button @click="resetFilters"
                        class="p-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-gray-300 text-black hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                        aria-label="Reset Filters">
                        <i class="fas fa-times text-sm"></i>
                    </button>

                    <select v-model="selectedProduct" id="productData" aria-placeholder="selected"
                        class="block w-40 rounded-md border-gray-300 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm">
                        <option value="" disabled selected>Select a product</option>
                        <option v-for="product in productData" :key="product.id" :value="product.id">
                            {{ product.name }}
                        </option>
                    </select>

                    <select v-model="selectedStatus" id="statuses"
                        class="block w-40 rounded-md border-gray-300 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm">
                        <option value="" disabled selected>Select a status</option>
                        <option v-for="status in statuses" :key="status" :value="status" class="capitalize">
                            {{ status }}
                        </option>
                    </select>

                    <Flatpickr v-model="selectedDate" :options="{ dateFormat: 'Y-m-d' }" placeholder="Due Date"
                        class="block w-36 rounded-md border-gray-300 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm" />

                    <!-- Export Button -->
                    <button @click="exportTransactions"
                        class="px-4 py-2 text-xs font-medium text-white bg-[#75ba2c] rounded hover:bg-[#75ba2c] focus:outline-none focus:ring-1 focus:ring-indigo-400">
                        Export
                    </button>
                </div>

            </div>

            <Table :columns="columns" :data="printerData" :fetchData="fetchPrinterData" :loading="loading"
                :pageCount="pageCount" :recordCount="recordCount" :action="['Edit']" :actionOnClick="handleAction"
                :showFilters="true" :onEdit="handleEdit" pageType="transactions" :exportFilter="getExportValues"
                :isReFetch="isReFetch">

                <template #name="{ value }">
                    <p class="cursor-pointer font-semibold text-gray-600" @click="handleEdit(value)">
                        {{ value.name }}
                    </p>
                </template>

                <template #productName="{ value }">
                    <span
                        class="inline-flex mr-1 whitespace-nowrap items-center rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200 bg-blue-100">
                        {{ value.product.name || 'N/A' }}
                    </span>
                </template>
                <template #borrower="{ value }">
                    <span @click="handleShowModal(value)"
                        :class="['cursor-pointer inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-xs font-semibold text-blue-400 hover:text-blue-600']">
                        {{ value.borrower.first_name }} {{ ' ' }} {{ value.borrower.last_name }}
                    </span>
                </template>

                <template #shipperName="{ value }">
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ value.borrower.shipper_name }}
                    </dd>
                </template>

                <template #nextDueDate="{ value }">
                    <span :class="['inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-sm text-gray-500']">
                        {{ fromUtc(value.next_due_date, 'yyyy-MM-dd') }}
                    </span>
                </template>

                <template #createdAt="{ value }">
                    <span :class="['inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-sm text-gray-500']">
                        {{ fromUtc(value.created_at, 'yyyy-MM-dd') }}
                    </span>
                </template>

                <template #status="{ value }">
                    <span :class="[statusColor[value.status] || '',
                        'inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-xs font-medium text-black',
                    ]">
                        {{ value.status }}
                    </span>
                </template>

                <template #actions="{ value }">
                    <Menu as="div" class="relative inline-block text-left">
                        <div>
                            <MenuButton
                                class="inline-flex w-full justify-center bg-gray-100 px-1 py-1 rounded-full text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">

                                <EllipsisVerticalIcon class="h-4 w-4 text-black" aria-hidden="true" />
                            </MenuButton>
                        </div>

                        <transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0">
                            <MenuItems
                                class="z-10 absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <div class="px-1 py-1">
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleView(value)">

                                        View
                                    </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </transition>
                    </Menu>
                </template>
            </Table>
        </div>
    </div>

    <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-50" @close="open = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl min-h-svh sm:p-6">
                            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    @click="open = false">
                                    <span class="sr-only">Close</span>
                                    <XMarkIcon class="size-6" aria-hidden="true" />
                                </button>
                            </div>

                            <div class="bg-white shadow sm:rounded-lg p-2 mt-4">
                                <div class="grid grid-cols-1 sm:hidden">
                                    <select aria-label="Select a tab"
                                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        v-model="currentTab">
                                        <option v-for="tab in tabs" :key="tab.name" :value="tab.name">
                                            {{ tab.name }}
                                        </option>
                                    </select>
                                    <ChevronDownIcon
                                        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                                        aria-hidden="true" />
                                </div>

                                <div class="hidden sm:block">
                                    <nav class="flex space-x-4" aria-label="Tabs">
                                        <a v-for="tab in tabs" :key="tab.name" href="#"
                                            @click.prevent="changeTab(tab.name)"
                                            :class="[tab.name === currentTab ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700', 'rounded-md px-3 py-2 text-sm font-medium']"
                                            :aria-current="tab.name === currentTab ? 'page' : undefined">
                                            {{ tab.name }}
                                        </a>
                                    </nav>
                                </div>
                            </div>

                            <div class="pt-4">
                                <div v-if="currentTab === 'Borrower'">
                                    <div class="px-4 sm:px-0">
                                        <div class="px-4 sm:px-0">
                                            <h3 class="text-base/7 font-semibold text-gray-900">Borrower Information
                                            </h3>
                                            <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details and
                                                application.
                                            </p>
                                        </div>
                                        <div v-if="selectedRowData" class="mt-6 border-t border-gray-100">
                                            <dl class="divide-y divide-gray-100">
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Full name</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.first_name }}
                                                        {{ ' ' }}
                                                        {{ selectedRowData.borrower.last_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Father name</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.father_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Mother name</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.mother_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">CNIC</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.cnic }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">CNIC Issuance Date
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.cnic_issuance_date }}
                                                    </dd>
                                                </div>
                                                  <!-- CNIC Front Image Preview -->
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm font-medium text-gray-900">CNIC Front Image</dt>
                                                        <dd class="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                                            <img 
                                                                :src="selectedRowData.borrower.cnic_front_image" 
                                                                alt="CNIC Front Image" 
                                                                class="w-24 h-16 cursor-pointer rounded-lg shadow"
                                                                @click="openImageModal(selectedRowData.borrower.cnic_front_image)"
                                                            />
                                                        </dd>
                                                    </div>

                                                    <!-- CNIC Back Image Preview -->
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm font-medium text-gray-900">CNIC Back Image</dt>
                                                        <dd class="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                                            <img 
                                                                :src="selectedRowData.borrower.cnic_back_image" 
                                                                alt="CNIC Back Image" 
                                                                class="w-24 h-16 cursor-pointer rounded-lg shadow"
                                                                @click="openImageModal(selectedRowData.borrower.cnic_back_image)"
                                                            />
                                                        </dd>
                                                    </div>

                                                    <!-- Full-Screen Image Modal -->
                                                    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                                                        <div class="relative">
                                                            <!-- Close Button -->
                                                            <button @click="showModal = false" class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg">
                                                                ❌
                                                            </button>
                                                            <!-- Enlarged Image -->
                                                            <img :src="modalImage" class="max-w-screen-md max-h-screen-md rounded-lg shadow-lg" />
                                                        </div>
                                                    </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Mobile Number</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.mobile_no }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Email address</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.email }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Date of birth</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.dob }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Wallet ID</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.wallet_id }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Shipper ID</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.shipper_id }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Address</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.address }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">City</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.city }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Status</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        <span :class="[
                                                            selectedRowData.borrower.status === 1 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300',
                                                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border'
                                                        ]">
                                                            {{ selectedRowData.borrower.status === 1 ? 'Active' :
                                                                'Inactive'
                                                            }}
                                                        </span>
                                                    </dd>
                                                </div>

                                                <!-- <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Salary expectation
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        $120,000
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">About</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        Fugiat
                                                        ipsum
                                                        ipsum deserunt culpa aute sint do nostrud anim incididunt cillum
                                                        culpa
                                                        consequat. Excepteur qui ipsum aliquip consequat sint. Sit id
                                                        mollit
                                                        nulla
                                                        mollit nostrud in ea officia proident. Irure nostrud pariatur
                                                        mollit
                                                        ad
                                                        adipisicing reprehenderit deserunt qui eu.</dd>
                                                </div> -->
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="currentTab === 'Charges'">
                                    <div class="px-4 sm:px-0">
                                        <h3 class="text-base/7 font-semibold text-gray-900">Charges Information</h3>
                                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Details about the charges.
                                        </p>
                                    </div>
                                </div>
                                <div v-if="currentTab === 'Transactions'">
                                    <div class="px-4 sm:px-0">
                                        <h3 class="text-base/7 font-semibold text-gray-900">Transaction History</h3>
                                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Details about the
                                            transactions.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4">

                            </div>
                            <!-- <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                    @click="open = false">Deactivate</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    @click="open = false" ref="cancelButtonRef">Cancel</button>
                            </div> -->
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <TransitionRoot as="template" :show="viewTransition">
        <Dialog class="relative z-50" @close="viewTransition = false">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl min-h-svh sm:p-6">
                            <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                <button type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    @click="viewTransition = false">
                                    <span class="sr-only">Close</span>
                                    <XMarkIcon class="size-6" aria-hidden="true" />
                                </button>
                            </div>

                            <div class="bg-white shadow sm:rounded-lg p-2 mt-4">
                                <div class="grid grid-cols-1 sm:hidden">
                                    <select aria-label="Select a tab"
                                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                        v-model="currentTabTransactions">
                                        <option v-for="tab in tabsTransactions" :key="tab.name" :value="tab.name">
                                            {{ tab.name }}
                                        </option>
                                    </select>
                                    <ChevronDownIcon
                                        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                                        aria-hidden="true" />
                                </div>

                                <div class="hidden sm:block">
                                    <nav class="flex space-x-4" aria-label="Tabs">
                                        <a v-for="tab in tabsTransactions" :key="tab.name" href="#"
                                            @click.prevent="changeTabTransactions(tab.name)"
                                            :class="[tab.name === currentTabTransactions ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700', 'rounded-md px-3 py-2 text-sm font-medium']"
                                            :aria-current="tab.name === currentTabTransactions ? 'page' : undefined">
                                            {{ tab.name }}
                                        </a>
                                    </nav>
                                </div>
                            </div>

                            <div class="pt-4">
                                <div v-if="currentTabTransactions === 'Transactions'">
                                    <div class="px-4 sm:px-0">
                                        <h3 class="text-base/7 font-semibold text-gray-900">Transaction History</h3>
                                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
                                            Details about the transactions.
                                        </p>
                                        <div v-if="selectedRowData" class="mt-6 border-t border-gray-100">
                                            <dl class="divide-y divide-gray-100">
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Borrower name
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.borrower.first_name }}
                                                        {{ ' ' }}
                                                        {{ selectedRowData.borrower.last_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Order Number
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.order_number }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Order Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.order_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Disbursed Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.disbursed_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Financing Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.loan_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Outstanding Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.outstanding_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Total Charges</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.total_charges }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Due Date</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.next_due_date }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Status</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        <span :class="[
                                                            selectedRowData.status === 'disbursed' ? 'bg-green-100 text-green-800 border-green-300' :
                                                                selectedRowData.status === 'completed' ? 'bg-purple-100 text-black border-purple-300' :
                                                                    'bg-red-100 text-red-800 border-red-300',
                                                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border'
                                                        ]">
                                                            {{ selectedRowData.status }}
                                                        </span>
                                                    </dd>
                                                </div>

                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Created At</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">

                                                        {{ fromUtc(selectedRowData.created_at, 'yyyy-MM-dd') }}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="currentTabTransactions === 'Installments'">
                                    <div class="px-4 sm:px-0">
                                        <div class="px-4 sm:px-0">
                                            <h3 class="text-base/7 font-semibold text-gray-900">Installments Information
                                            </h3>
                                            <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details and
                                                application.
                                            </p>
                                        </div>

                                        <div class="mt-8 flow-root">
                                            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                                    <table class="min-w-full divide-y divide-gray-300">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col"
                                                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                                    Amount</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Outstanding</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Due date</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    status</th>
                                                                <th scope="col"
                                                                    class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                                    <span class="sr-only">Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="divide-y divide-gray-200">
                                                            <tr v-for="person in selectedRowData.installments"
                                                                :key="person.id">
                                                                <td
                                                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {{ person.amount }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.outstanding }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.due_date }}</td>
                                                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                                                    <span :class="[
                                                                        'inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-xs font-medium',
                                                                        person.status === 'paid' ? 'bg-green-300 text-black-800' : 'bg-red-400 text-black-800'
                                                                    ]">
                                                                        {{ person.status }}
                                                                    </span>
                                                                </td>
                                                                <td
                                                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                    <!-- <a href="#"
                                                                        class="text-indigo-600 hover:text-indigo-900">Edit<span
                                                                            class="sr-only">, {{ person.name
                                                                            }}</span></a> -->
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="currentTabTransactions === 'Charges'">
                                    <div class="px-4 sm:px-0">
                                        <h3 class="text-base/7 font-semibold text-gray-900">Charges Information</h3>
                                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Details about the charges.
                                        </p>

                                        <div class="mt-8 flow-root">
                                            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                                    <table class="min-w-full divide-y divide-gray-300">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col"
                                                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 whitespace-nowrap">
                                                                    Name</th>
                                                                <th scope="col"
                                                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 whitespace-nowrap">
                                                                    Condition</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                                    Amount</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                                    Fed Amount</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                                    Status</th>
                                                                <th scope="col"
                                                                    class="relative py-3.5 pl-3 pr-4 sm:pr-0 whitespace-nowrap">
                                                                    <span class="sr-only">Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="divide-y divide-gray-200">
                                                            <tr v-for="person in selectedRowData.charges"
                                                                :key="person.id">
                                                                <td
                                                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {{ person.name }}</td>
                                                                <td
                                                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {{ person.charge_condition }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.charge_amount }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.fed_amount }}</td>
                                                                <td class="whitespace-nowrap px-3 py-4 text-sm">
                                                                    <span :class="[
                                                                        'inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-xs font-medium',
                                                                        person.status === 'paid' ? 'bg-green-300 text-black-800' : 'bg-red-300 text-red-800'
                                                                    ]">
                                                                        {{ person.status }}
                                                                    </span>
                                                                </td>
                                                                <td
                                                                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                    <!-- <a href="#"
                                                                        class="text-indigo-600 hover:text-indigo-900">Edit<span
                                                                            class="sr-only">, {{ person.name
                                                                            }}</span></a> -->
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-4">
                            </div>
                            <!-- <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                <button type="button"
                                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                    @click="open = false">Deactivate</button>
                                <button type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    @click="open = false" ref="cancelButtonRef">Cancel</button>
                            </div> -->
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

</template>
