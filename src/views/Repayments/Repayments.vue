<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon, PaperClipIcon } from '@heroicons/vue/20/solid'
import Table from '../../components/Table.vue';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';
import { fromUtc } from '../../utils/datetime';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import { watch } from 'vue';

const open = ref(false)
const viewTransition = ref(false)

const router = useRouter();

const columns = [
    { Header: 'Id', accessor: 'id' },
    { Header: 'Applicant', accessor: 'applicant', slotName: "applicant" },
    { Header: 'Product Name', accessor: 'application', slotName: "productName" },
    { Header: 'Shipper', accessor: 'applicant', slotName: "shipperName" },
    { Header: 'Order Number', accessor: 'application', slotName: "orderNumber" },
    { Header: 'Amount', accessor: 'amount' },
    { Header: 'Paid at', accessor: 'paid_at', slotName: "paidAt" },
    { Header: 'Create Date', accessor: 'created_at', slotName: "showDate" },
    { Header: 'Status', accessor: 'status', slotName: "status" },
    { Header: 'Action', accessor: 'actions', slotName: "actions" },
]

const printerData = ref([])
const loading = ref(false)
const isReFetch = ref(false)
const pageCount = ref(0)
const recordCount = ref(0)

const isShowPreview = ref(false)
const selectedRowData = ref(null);

const productData = ref([])
const selectedProduct = ref('')

watch([selectedProduct], () => {
    isReFetch.value = !isReFetch.value
});

const resetFilters = () => {
    selectedProduct.value = ''
};

const tabs = ref([
    { name: 'Applicant', current: true },
    // { name: 'Charges', current: false },
    // { name: 'Applications', current: false },
]);

const tabsApplications = ref([
    { name: 'Applications', current: true },
    // { name: 'Charges', current: false },
    { name: 'Installments', current: false },
]);

const currentTab = ref('Applicant');

const changeTab = (tabName) => {
    currentTab.value = tabName;
};

const currentTabApplications = ref('Applications');

const changeTabApplications = (tabName) => {
    currentTabApplications.value = tabName;
};

const fetchPrinterData = async ({ pageIndex = 0, pageSize = 10, search = '', from_date = null, to_date = null }) => {
    loading.value = true;

    try {
        const dropdownFilters = {};
        if (selectedProduct.value) {
            dropdownFilters["application.product_id"] = selectedProduct.value;
        }

        // Construct search_table dynamically
        const searchTable = [];
        if (search) {
            searchTable.push({ key: "application.order_number", value: search });
        }

        const params = {
            pagination: true,
            page: pageIndex + 1, // Convert 0-based index to 1-based
            per_page: pageSize,
            search: search.trim(), // Trim whitespace from the search query
            sort_field: "repayments.id",
            sort_order: "DESC",
            from_date: from_date, // Pass from_date
            to_date: to_date,     // Pass to_date
            dropdown_filters: JSON.stringify(dropdownFilters) // Convert to JSON string
        };

        const response = await axios.get(API.REPAYMENTS, {
            params,
        });

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


const handleAction = (action, row) => {
    if (action === 'Edit') {
        console.log('Edit action on:', row);
        // handleEdit(row);
    }
    //  else if (action === 'Delete') {
    //     console.log('Delete action on:', row);
    //     handleDelete(row);  // Delete the user
    // }
}

const handleView = async (row) => {
    selectedRowData.value = { ...row }
    viewTransition.value = true
}

const handleSyncApplicantProduct = async (row) => {
    router.push({
        name: 'SyncApplicantProducts',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleEdit = async (row) => {
    router.push({
        name: 'EditApplicants',
        params: { id: row.id },
    });
}

const handleShowModal = (row) => {
    selectedRowData.value = { ...row }
    open.value = true
}

const tableRef = ref(null); // Reference to the Table component

const exportRepayment = async () => {
    try {

        const dropdownFilters = {};
        if (selectedProduct.value) {
            dropdownFilters["application.product_id"] = selectedProduct.value;
        }

        // Construct search_table dynamically
        const searchTable = [];
        if (tableRef.value?.searchQuery) {
            searchTable.push({ key: "application.order_number", value: tableRef.value?.searchQuery });
        }

        const params = {
            search: tableRef.value?.searchQuery || '', // Access the searchQuery from the Table component
            from_date: tableRef.value?.fromDate || null, // Access fromDate from the Table component
            to_date: tableRef.value?.toDate || null,
            search_table: JSON.stringify(searchTable),
            dropdown_filters: JSON.stringify(dropdownFilters)   // Access toDate from the Table component
        };

        const response = await axios.get(API.EXPORT_REPAYMENTS, {
            params,
            responseType: 'blob', // To handle file download
        });

        // Trigger download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'repayments.xlsx'); // File name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting repayments:', error.response || error.message);
    }
};

const getExportValues = ({ newFromDate, newToDate, searchQuery }) => {
    tableRef.value = {
        searchQuery: searchQuery,
        fromDate: newFromDate,
        toDate: newToDate,
    }
}

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

const handleUpdateApplicationStatus = async (row) => {
    // try {
    //     loading.value = true;

    //     const payload = {
    //         status: row.status === 1 ? 0 : 1
    //     };

    //     await axios.patch(API.APPLICANTS_STATUS.replace('{applicant}', row.id), payload);
    //     showMessageAlert({ message: 'Successfully Update Status', type: 'success' });
    //     fetchPrinterData({ pageIndex: 0, pageSize: 10 })
    // } catch (error) {
    //     showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
    //     console.error('Error Update:', error);
    // } finally {
    //     loading.value = false;
    // }
}

onMounted(() => {
    fetchPrinterData({ pageIndex: 0, pageSize: 10 })
    getProductData()
})
</script>

<template>
    <div class="px-2 sm:px-2 lg:px-4">
        <div class="sm:flex sm:items-center justify-between">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-gray-900">Repayments</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all repayments information.</p>
            </div>
            <div class="flex items-center space-x-2">
                <!-- Reset Filters Button -->
                <button @click="resetFilters"
                    class="p-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-gray-300 text-black hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
                    aria-label="Reset Filters">
                    <i class="fas fa-times text-sm"></i>
                </button>

                <select v-model="selectedProduct" id="productData" aria-placeholder="selected"
                    class="block w-40 rounded-md border-gray-300 text-black py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 sm:text-sm">
                    <option value="" disabled selected>Select a product</option>
                    <option v-for="product in productData" :key="product.id" :value="product.id">
                        {{ product.name }}
                    </option>
                </select>
                <!-- Export Button -->
                <button @click="exportRepayment"
                    class="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-400">
                    Export
                </button>
            </div>
        </div>

        <div>
            <Table :columns="columns" :data="printerData" :fetchData="fetchPrinterData" :loading="loading"
                :pageCount="pageCount" :recordCount="recordCount" :action="['Edit']" :actionOnClick="handleAction"
                :onEdit="handleEdit" pageType="products" :showFilters="true" :exportFilter="getExportValues"
                :isReFetch="isReFetch">

                <template #name="{ value }">
                    <p class="cursor-pointer font-semibold text-gray-600" @click="handleEdit(value)">
                        {{ value.name }}
                    </p>
                </template>

                <template #applicant="{ value }">
                    <span @click="handleShowModal(value)"
                        :class="['cursor-pointer inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-xs font-semibold text-blue-400 hover:text-blue-600']">
                        {{ value.applicant.first_name }} {{ ' ' }} {{ value.applicant.last_name }}
                    </span>
                </template>
                <template #shipperName="{ value }">
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ value.applicant.shipper_name }}
                    </dd>
                </template>

                <template #orderNumber="{ value }">
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ value.application.order_number }}
                    </dd>
                </template>

                <template #productName="{ value }">
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ value.application.product }}
                    </dd>
                </template>

                <template #paidAt="{ value }">
                    <span :class="['inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-sm text-gray-500']">
                        {{ fromUtc(value.paid_at, 'yyyy-MM-dd') }}
                    </span>
                </template>

                <template #showDate="{ value }">
                    <span :class="['inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-sm text-gray-500']">
                        {{ fromUtc(value.created_at, 'yyyy-MM-dd') }}
                    </span>
                </template>

                <template #status="{ value }">
                    <span :class="[value.status === 'paid' ? 'bg-green-400' : 'bg-red-400',
                        'inline-flex items-center gap-x-1.5 rounded-md px-3 py-1 text-xs font-medium text-black',
                    ]">
                        {{ value.status }}
                    </span>
                </template>

                <template #actions="{ value }">
                    <Menu as="div" class="inline-block text-left">
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
                                class="z-50 absolute right-0 mt-2 w-40 origin-top-right divide-y divide-slate-800 rounded-xl bg-slate-900 shadow-lg shadow-black/40 ring-1 ring-slate-800 focus:outline-none">
                                <div class="px-1 py-1">
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleView(value)">

                                        View
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleUpdateApplicationStatus(value)">

                                        {{ value.status === 1 ? "Disable" : "Enable" }}
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
                                <div v-if="currentTab === 'Applicant'">
                                    <div class="px-4 sm:px-0">
                                        <div class="px-4 sm:px-0">
                                            <h3 class="text-base/7 font-semibold text-gray-900">Applicant Information
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
                                                        {{ selectedRowData.applicant.first_name }}
                                                        {{ ' ' }}
                                                        {{ selectedRowData.applicant.last_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Father name</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.father_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Mother name</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.mother_name }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">CNIC</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.cnic }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">CNIC Issuance Date
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.cnic_issuance_date }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Mobile Number</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.mobile_no }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Email address</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.email }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Date of birth</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.dob }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Wallet ID</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.wallet_id }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Shipper ID</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.shipper_id }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Address</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.address }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">City</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.applicant.city }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Status</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        <span :class="[
                                                            selectedRowData.applicant.status === 1 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300',
                                                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border'
                                                        ]">
                                                            {{ selectedRowData.applicant.status === 1 ? 'Active' :
                                                                'Inactive'
                                                            }}
                                                        </span>
                                                    </dd>
                                                </div>
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
                                <div v-if="currentTab === 'Applications'">
                                    <div class="px-4 sm:px-0">
                                        <h3 class="text-base/7 font-semibold text-gray-900">Application History</h3>
                                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Details about the
                                            applications.</p>
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
                                        v-model="currentTabApplications">
                                        <option v-for="tab in tabsApplications" :key="tab.name" :value="tab.name">
                                            {{ tab.name }}
                                        </option>
                                    </select>
                                    <ChevronDownIcon
                                        class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                                        aria-hidden="true" />
                                </div>

                                <div class="hidden sm:block">
                                    <nav class="flex space-x-4" aria-label="Tabs">
                                        <a v-for="tab in tabsApplications" :key="tab.name" href="#"
                                            @click.prevent="changeTabApplications(tab.name)"
                                            :class="[tab.name === currentTabApplications ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700', 'rounded-md px-3 py-2 text-sm font-medium']"
                                            :aria-current="tab.name === currentTabApplications ? 'page' : undefined">
                                            {{ tab.name }}
                                        </a>
                                    </nav>
                                </div>
                            </div>

                            <div class="pt-4">
                                <div v-if="currentTabApplications === 'Applications'">
                                    <div class="px-4 sm:px-0">
                                        <h3 class="text-base/7 font-semibold text-gray-900">Application History</h3>
                                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
                                            Details about the applications.
                                        </p>
                                        <div v-if="selectedRowData" class="mt-6 border-t border-gray-100">
                                            <dl class="divide-y divide-gray-100">
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Product name
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.product }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Product code
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.product_code }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Product plan
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.product_plan }}
                                                        {{ "(" }}
                                                        {{ selectedRowData.application.product_plan_duration }}
                                                        {{ "-" }}
                                                        {{ selectedRowData.application.product_plan_duration_unit }}
                                                        {{ ")" }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Disbursed Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.disbursed_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Loan Amount</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.loan_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Outstanding Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.outstanding_amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Total Charges</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.application.total_charges }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Status</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        <span :class="[
                                                            selectedRowData.application.status === 'disbursed' ? 'bg-green-100 text-green-800 border-green-300' :
                                                                selectedRowData.application.status === 'completed' ? 'bg-purple-100 text-black border-purple-300' :
                                                                    'bg-red-100 text-red-800 border-red-300',
                                                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border'
                                                        ]">
                                                            {{ selectedRowData.application.status }}
                                                        </span>
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="currentTabApplications === 'Installments'">
                                    <div class="px-4 sm:px-0">
                                        <div class="px-4 sm:px-0">
                                            <h3 class="text-base/7 font-semibold text-gray-900">Installments Information
                                            </h3>
                                            <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
                                                Personal details of installments.
                                            </p>
                                        </div>

                                        <div v-if="selectedRowData" class="mt-6 border-t border-gray-100">
                                            <dl class="divide-y divide-gray-100">
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Amount
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.installment.amount }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Outstanding
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{ selectedRowData.installment.outstanding }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Created at
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{
                                                            fromUtc(selectedRowData.installment.created_at, 'yyyy-MM-dd')
                                                        }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">
                                                        Due date
                                                    </dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        {{
                                                            fromUtc(selectedRowData.installment.due_date, 'yyyy-MM-dd')
                                                        }}
                                                    </dd>
                                                </div>
                                                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                    <dt class="text-sm/6 font-medium text-gray-900">Status</dt>
                                                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                        <span :class="[
                                                            selectedRowData.installment.status === 'paid' ? 'bg-green-300 text-green-800 border-green-400' : 'bg-red-300 text-red-800 border-red-300',
                                                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border'
                                                        ]">
                                                            {{ selectedRowData.installment.status === 'paid' ? 'Paid' :
                                                                'Unpaid' }}
                                                        </span>
                                                    </dd>
                                                </div>

                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="currentTabApplications === 'Charges'">
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
                                                                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                                    Charge Condition</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Fed Amount</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Apply Fed</th>
                                                                <th scope="col"
                                                                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                                    Charge Amount</th>
                                                                <th scope="col"
                                                                    class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                                    <span class="sr-only">Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="divide-y divide-gray-200">
                                                            <tr v-for="person in selectedRowData.charges"
                                                                :key="person.id">
                                                                <td
                                                                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                                    {{ person.charge_condition }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.fed_amount }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.apply_fed }}</td>
                                                                <td
                                                                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                                    {{ person.charge_amount }}</td>

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
