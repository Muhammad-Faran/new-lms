<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'; // Import useRouter


import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import Table from '../../components/Table.vue';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import SectionHeader from './SectionHeader.vue';
import TabContent from './TabContent.vue';

const router = useRouter();

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'First Name', accessor: 'first_name' },
    { Header: 'Last Name', accessor: 'last_name' },
    { Header: 'Shipper Name', accessor: 'shipper_name' },
    { Header: 'Wallet ID', accessor: 'wallet_id' },
    { Header: 'Shipper ID', accessor: 'shipper_id' },
    { Header: 'Mobile', accessor: 'mobile_no' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'CNIC', accessor: 'cnic' },
    { Header: 'Status', accessor: 'status', slotName: "status" },
    { Header: 'Action', accessor: 'actions', slotName: "actions" },
]

const printerData = ref([])
const loading = ref(false)
const pageCount = ref(0)
const recordCount = ref(0)

const showModal = ref(false);
const modalImage = ref(null);

const open = ref(false)
const selectedRowData = ref(null);

const tabs = ref([
    { name: 'Applicant', current: true },
    { name: 'Shipper Credit Score', current: false },
    { name: 'Shipper Info', current: false },
    { name: 'Shipper KYC', current: false },
    { name: 'Shipper Pricing', current: false },
    { name: 'Ofac Nacta', current: false }
]);


const currentTab = ref('Applicant');

const changeTab = (tabName) => {
    currentTab.value = tabName;
};
const resetTab = () => {
    currentTab.value = 'Applicant';
};

const openImageModal = (imageUrl) => {
    modalImage.value = imageUrl;
    showModal.value = true;
};


const handleDialogClose = () => {
    open.value = false;
    resetTab();
};

const isShowPreview = ref(false)
const form = ref({
    name: '',
    code: '',
    limit: null,
    max_requested_amount: null,
    min_requested_amount: null,
    default_status: 'review',
    status: '1',
    tnc: '',
    avatar: null,
    description: '',
    product_books: [],
    product_tier_charges: [],
    product_tiers: [],
    product_plans: [],
});

const fetchPrinterData = async ({ pageIndex = 0, pageSize = 10, search = '' }) => {
    loading.value = true;

    try {
        const params = {
            pagination: true,
            page: pageIndex + 1, // Convert 0-based index to 1-based
            per_page: pageSize,
            search: search.trim(), // Trim whitespace from the search query
            sort_field: "applicants.id",
            sort_order: "DESC"
        };

        const response = await axios.get(API.APPLICANTS, {
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

const loadingRefresh = ref(false);

const refreshOfacNacta = async (applicantId) => {
    loadingRefresh.value = true; // Show loader
    try {
        const response = await axios.post(API.REFRESH_OFAC_NACTA, {
            applicant_id: applicantId,
        });

        // Update the selectedRowData dynamically
        selectedRowData.value.credit_engine_data.ofac_nacta = response.data.data.data;

        showMessageAlert({ message: 'OFAC NACTA refreshed successfully', type: 'success' });
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.error || 'Failed to refresh OFAC NACTA', type: 'error' });
    } finally {
        loadingRefresh.value = false; // Hide loader
    }
};

const refreshShipperCreditScore = async (applicantId) => {
    loadingRefresh.value = true; // Show loader
    try {
        const response = await axios.post(API.REFRESH_SHIPPER_CREDIT_SCORE, {
            applicant_id: applicantId,
        });

        // Update the selectedRowData dynamically
        selectedRowData.value.credit_engine_data.shipper_credit_score = response.data.data.data;

        showMessageAlert({ message: 'Shipper Credit Score Refreshed Successfully', type: 'success' });
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.error || 'Failed to refresh Shipper Credit Score', type: 'error' });
    } finally {
        loadingRefresh.value = false; // Hide loader
    }
};

const refreshShipperInfo = async (applicantId) => {
    loadingRefresh.value = true; // Show loader
    try {
        const response = await axios.post(API.REFRESH_SHIPPER_INFO, {
            applicant_id: applicantId,
        });

        // Update the selectedRowData dynamically
        selectedRowData.value.credit_engine_data.shipper_info = response.data.data.data;

        showMessageAlert({ message: 'Shipper Info Refreshed Successfully', type: 'success' });
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.error || 'Failed to refresh Shipper Info', type: 'error' });
    } finally {
        loadingRefresh.value = false; // Hide loader
    }
};

const refreshShipperKYC = async (applicantId) => {
    loadingRefresh.value = true; // Show loader
    try {
        const response = await axios.post(API.REFRESH_SHIPPER_KYC, {
            applicant_id: applicantId,
        });

        // Update the selectedRowData dynamically
        selectedRowData.value.credit_engine_data.shipper_kyc = response.data.data.data;

        showMessageAlert({ message: 'Shipper kyc Refreshed Successfully', type: 'success' });
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.error || 'Failed to refresh Shipper kyc', type: 'error' });
    } finally {
        loadingRefresh.value = false; // Hide loader
    }
};

const refreshShipperPricing = async (applicantId) => {
    loadingRefresh.value = true; // Show loader
    try {
        const response = await axios.post(API.REFRESH_SHIPPER_PRICING, {
            applicant_id: applicantId,
        });

        // Update the selectedRowData dynamically
        selectedRowData.value.credit_engine_data.shipper_pricing = response.data.data.data;

        showMessageAlert({ message: 'Shipper pricing Refreshed Successfully', type: 'success' });
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.error || 'Failed to refresh Shipper pricing', type: 'error' });
    } finally {
        loadingRefresh.value = false; // Hide loader
    }
};

const formatFactor = (factor) => {
    return factor.replace(/^p_/, '') // Remove leading 'p_'
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};


const handleAction = (action, row) => {
    if (action === 'Edit') {
        handleEdit(row);
    }
    //  else if (action === 'Delete') {
    //     console.log('Delete action on:', row);
    //     handleDelete(row);  // Delete the user
    // }
}

const handleView = async (row) => {
    selectedRowData.value = { ...row }
    open.value = true

    // router.push({
    //     name: 'ViewApplicants',
    //     params: { id: row.id },
    // });
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

const handleConfigureApplicantDetails = async (row) => {
    router.push({
        name: 'ConfigureApplicantDetails',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleAssignCreditLimit = async (row) => {
    router.push({
        name: 'AssignCreditLimit',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleAssignFinancingPolicy = async (row) => {
    router.push({
        name: 'AssignFinancingPolicy',
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

const handleUpdateApplicantStatus = async (row) => {
    try {
        loading.value = true;

        const payload = {
            status: row.status === 1 ? 0 : 1,
            wallet_id: row.wallet_id
        };

        await axios.patch(API.APPLICANTS_STATUS, payload);
        showMessageAlert({ message: 'Successfully Update Status', type: 'success' });
        fetchPrinterData({ pageIndex: 0, pageSize: 20 })
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error Update:', error);
    } finally {
        loading.value = false;
    }
}

const goToAddUser = () => {
    router.push({ name: 'AddApplicants' });
}

onMounted(() => {
    fetchPrinterData({ pageIndex: 0, pageSize: 20 })
})
</script>

<template>
    <div class="px-2 sm:px-2 lg:px-4 ">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-slate-900">Applicants</h1>
                <p class="mt-2 text-sm text-slate-600">A list of all the applicants in your account.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button type="button"
                    class="block rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="goToAddUser">
                    Add Applicant
                </button>
            </div>
        </div>

        <!-- mt-4 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-2xl shadow-black/40 backdrop-blur -->
        <div class="relative overflow-visible">
            <Table :columns="columns" :data="printerData" :fetchData="fetchPrinterData" :loading="loading"
                :pageCount="pageCount" :recordCount="recordCount" :action="['Edit']" :actionOnClick="handleAction"
                :onEdit="handleEdit" pageType="products">

                <template #name="{ value }">
                    <p class="cursor-pointer font-semibold text-slate-100 hover:text-emerald-300"
                        @click="handleEdit(value)">
                        {{ value.name }}
                    </p>
                </template>

                <template #status="{ value }">
                    <span :class="[value.status === 1 ? 'bg-emerald-600/80 text-emerald-50' : 'bg-rose-600/80 text-rose-50',
                        'inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm shadow-black/30',
                    ]">
                        {{ value.status === 1 ? 'Enabled' : 'Disabled' }}
                    </span>
                </template>

                <template #actions="{ value }">
                    <Menu as="div" class="inline-block text-left">
                        <div>
                            <MenuButton
                                class="inline-flex w-full justify-center rounded-full bg-slate-800/80 px-1 py-1 text-sm font-medium text-slate-100 shadow-sm shadow-black/30 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">

                                <EllipsisVerticalIcon class="h-4 w-4 text-slate-100" aria-hidden="true" />
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
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleView(value)">

                                        View
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleConfigureApplicantDetails(value)">
                                        Settings
                                    </button>
                                    </MenuItem>
                                    <!-- <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleAssignCreditLimit(value)">

                                        Assign Credit limit
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleAssignFinancingPolicy(value)">
                                        Assign Financing
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleSyncApplicantProduct(value)">

                                        Sync Products
                                    </button>
                                    </MenuItem> -->
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleUpdateApplicantStatus(value)">

                                        {{ value.status === 1 ? "Disable" : "Enable" }}
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleEdit(value)">

                                        Edit
                                    </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </transition>
                    </Menu>
                </template>
            </Table>
        </div>
        <TransitionRoot as="template" :show="open">
            <Dialog class="relative z-50" @close="handleDialogClose">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
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
                                                <h3 class="text-base/7 font-semibold text-gray-900">Applicant
                                                    Information
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
                                                            {{ selectedRowData.first_name }}
                                                            {{ ' ' }}
                                                            {{ selectedRowData.last_name }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Father name</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.father_name }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">CNIC</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.cnic }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">CNIC Issuance
                                                            Date</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.cnic_issuance_date }}
                                                        </dd>
                                                    </div>
                                                    <!-- CNIC Front Image Preview -->
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm font-medium text-gray-900">CNIC Front Image
                                                        </dt>
                                                        <dd class="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                                            <img :src="selectedRowData.cnic_front_image"
                                                                alt="CNIC Front Image"
                                                                class="w-24 h-16 cursor-pointer rounded-lg shadow"
                                                                @click="openImageModal(selectedRowData.cnic_front_image)" />
                                                        </dd>
                                                    </div>

                                                    <!-- CNIC Back Image Preview -->
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm font-medium text-gray-900">CNIC Back Image
                                                        </dt>
                                                        <dd class="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                                            <img :src="selectedRowData.cnic_back_image"
                                                                alt="CNIC Back Image"
                                                                class="w-24 h-16 cursor-pointer rounded-lg shadow"
                                                                @click="openImageModal(selectedRowData.cnic_back_image)" />
                                                        </dd>
                                                    </div>

                                                    <!-- Full-Screen Image Modal -->
                                                    <div v-if="showModal"
                                                        class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                                                        <div class="relative">
                                                            <!-- Close Button -->
                                                            <button @click="showModal = false"
                                                                class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg">
                                                                ❌
                                                            </button>
                                                            <!-- Enlarged Image -->
                                                            <img :src="modalImage"
                                                                class="max-w-screen-md max-h-screen-md rounded-lg shadow-lg" />
                                                        </div>
                                                    </div>

                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Date of birth
                                                        </dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.dob }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Email address
                                                        </dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.email }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Wallet ID
                                                        </dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.wallet_id }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Shipper ID
                                                        </dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.shipper_id }}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- OFAC NACTA Tab -->
                                    <div v-if="currentTab === 'Ofac Nacta'">
                                        <div class="flex items-center justify-between">
                                            <!-- Title -->
                                            <SectionHeader title="OFAC NACTA Information"
                                                description="Details about the OFAC NACTA matches." />

                                            <!-- Refresh Button and Loader -->
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                                    @click="refreshOfacNacta(selectedRowData.id)"
                                                    :disabled="loadingRefresh">
                                                    Refresh
                                                </button>
                                                <!-- Loader Placeholder -->
                                                <div class="relative w-5 h-5">
                                                    <div v-if="loadingRefresh"
                                                        class="absolute inset-0 loader spinner-border animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <!-- OFAC Matches -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">OFAC Matches</h3>
                                            <template
                                                v-if="selectedRowData.credit_engine_data?.ofac_nacta?.ofac_matches?.length">
                                                <table class="min-w-full divide-y divide-gray-200 mt-4">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                AKA</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Name</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Country</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Year of Birth</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(match, index) in selectedRowData.credit_engine_data.ofac_nacta.ofac_matches"
                                                            :key="index" class="bg-white odd:bg-gray-50">
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.row.aka
                                                            }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.name }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.country }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.year_of_birth }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.score
                                                            }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </template>
                                            <p v-else class="text-sm text-gray-500 mt-2">No OFAC Matches available.</p>
                                        </div>

                                        <!-- UNSC Matches -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">UNSC Matches</h3>
                                            <template
                                                v-if="selectedRowData.credit_engine_data?.ofac_nacta?.unsc_matches?.length">
                                                <table class="min-w-full divide-y divide-gray-200 mt-4">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                AKA</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Name</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Country</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Year of Birth</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(match, index) in selectedRowData.credit_engine_data.ofac_nacta.unsc_matches"
                                                            :key="index" class="bg-white odd:bg-gray-50">
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.row.aka
                                                            }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.name }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.country }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.year_of_birth }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.score
                                                            }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </template>
                                            <p v-else class="text-sm text-gray-500 mt-2">No UNSC Matches available.</p>
                                        </div>
                                    </div>


                                    <!-- Shipper Credit Score Tab -->
                                    <!-- Shipper Credit Score Tab -->
                                    <div v-if="currentTab === 'Shipper Credit Score'">
                                        <div class="flex items-center justify-between">
                                            <!-- Title -->
                                            <SectionHeader title="Shipper Credit Score Information"
                                                description="Details about the shipper's credit score." />

                                            <!-- Refresh Button and Loader -->
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                                    @click="refreshShipperCreditScore(selectedRowData.id)"
                                                    :disabled="loadingRefresh">
                                                    Refresh
                                                </button>
                                                <div class="relative w-5 h-5">
                                                    <div v-if="loadingRefresh"
                                                        class="absolute inset-0 loader spinner-border animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Category with Color Background -->
                                        <div class="mt-4 rounded-lg p-4 shadow-lg text-white text-center"
                                            :style="{ backgroundColor: selectedRowData.credit_engine_data?.shipper_credit_score?.color_code || '#ccc' }">
                                            <h3 class="text-xl font-semibold">
                                                {{ selectedRowData.credit_engine_data?.shipper_credit_score?.category }}
                                            </h3>
                                        </div>

                                        <!-- Credit Score -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Credit Score</h3>
                                            <p class="text-sm text-gray-900">
                                                {{
                                                    Math.ceil(selectedRowData.credit_engine_data?.shipper_credit_score?.credit_score
                                                        * 100) / 100 }}
                                            </p>
                                        </div>

                                        <!-- Description -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Description</h3>
                                            <p class="text-sm text-gray-900">
                                                {{ selectedRowData.credit_engine_data?.shipper_credit_score?.description
                                                }}
                                            </p>
                                        </div>

                                        <!-- Strong Factors -->
                                        <div class="mt-4 border rounded-lg p-4 bg-green-50 shadow">
                                            <h3 class="text-base font-semibold text-green-700">Strong Factors</h3>
                                            <p class="text-sm text-green-900">
                                                {{
                                                    selectedRowData.credit_engine_data?.shipper_credit_score?.factors_impacting_score?.strong_factors
                                                }}
                                            </p>
                                        </div>

                                        <!-- Weak Factors -->
                                        <div class="mt-4 border rounded-lg p-4 bg-red-50 shadow">
                                            <h3 class="text-base font-semibold text-red-700">Weak Factors</h3>
                                            <p class="text-sm text-red-900">
                                                {{
                                                    selectedRowData.credit_engine_data?.shipper_credit_score?.factors_impacting_score?.weak_factors
                                                }}
                                            </p>
                                        </div>

                                        <!-- Improvement Tips -->
                                        <div class="mt-4 border rounded-lg p-4 bg-blue-50 shadow">
                                            <h3 class="text-base font-semibold text-blue-700">Improvement Tips</h3>
                                            <ul class="list-disc list-inside text-sm text-blue-900">
                                                <li v-for="(tip, index) in selectedRowData.credit_engine_data?.shipper_credit_score?.improvement_tips"
                                                    :key="index">
                                                    {{ tip }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>



                                    <!-- Shipper Info Tab -->
                                    <div v-if="currentTab === 'Shipper Info'">
                                        <div class="flex items-center justify-between">
                                            <!-- Title -->
                                            <SectionHeader title="Shipper Information"
                                                description="Details about the shipper." />

                                            <!-- Refresh Button and Loader -->
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                                    @click="refreshShipperInfo(selectedRowData.id)"
                                                    :disabled="loadingRefresh">
                                                    Refresh
                                                </button>
                                                <!-- Loader Placeholder -->
                                                <div class="relative w-5 h-5">
                                                    <div v-if="loadingRefresh"
                                                        class="absolute inset-0 loader spinner-border animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Shipper Info Details -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Shipper Information</h3>
                                            <div v-if="selectedRowData.credit_engine_data.shipper_info">
                                                <div v-for="(value, key) in selectedRowData.credit_engine_data.shipper_info"
                                                    :key="key"
                                                    class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                                                    <div class="font-medium text-sm text-gray-600 capitalize">{{
                                                        key.replace(/_/g, ' ') }}</div>
                                                    <div class="text-sm text-gray-900">{{ value }}</div>
                                                </div>
                                            </div>
                                            <div v-else class="text-sm text-gray-500">No Shipper Information available.
                                            </div>
                                        </div>
                                    </div>


                                    <div v-if="currentTab === 'Shipper KYC'">


                                        <div class="flex items-center justify-between">
                                            <!-- Title -->
                                            <SectionHeader title="Shipper KYC Information"
                                                description="Details about the Shipper KYC." />

                                            <!-- Refresh Button and Loader -->
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                                    @click="refreshShipperKYC(selectedRowData.id)"
                                                    :disabled="loadingRefresh">
                                                    Refresh
                                                </button>
                                                <!-- Loader Placeholder -->
                                                <div class="relative w-5 h-5">
                                                    <div v-if="loadingRefresh"
                                                        class="absolute inset-0 loader spinner-border animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Bureau Level Checks -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Bureau Level Checks</h3>
                                            <ul
                                                v-if="selectedRowData.credit_engine_data.shipper_kyc?.bureau_level_checks && selectedRowData.credit_engine_data.shipper_kyc.bureau_level_checks.length > 0">
                                                <li v-for="(check, index) in selectedRowData.credit_engine_data.shipper_kyc.bureau_level_checks"
                                                    :key="index" class="py-2 border-b border-gray-200">
                                                    <span class="font-medium text-sm text-gray-600">{{ check }}</span>
                                                </li>
                                            </ul>
                                            <div v-else class="text-sm text-gray-500">No Bureau Level Checks available.
                                            </div>
                                        </div>

                                        <!-- Personal Info -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Personal Info</h3>
                                            <ul
                                                v-if="selectedRowData.credit_engine_data.shipper_kyc?.personal_info && selectedRowData.credit_engine_data.shipper_kyc.personal_info.length > 0">
                                                <li v-for="(info, index) in selectedRowData.credit_engine_data.shipper_kyc.personal_info"
                                                    :key="index" class="py-2 border-b border-gray-200">
                                                    <span class="font-medium text-sm text-gray-600">{{ info }}</span>
                                                </li>
                                            </ul>
                                            <div v-else class="text-sm text-gray-500">No Personal Info available.</div>
                                        </div>

                                        <!-- Trax DB Logs -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Trax DB Logs</h3>
                                            <div v-if="selectedRowData.credit_engine_data.shipper_kyc?.trax_db_logs">
                                                <div v-for="(value, key) in selectedRowData.credit_engine_data.shipper_kyc.trax_db_logs"
                                                    :key="key"
                                                    class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                                                    <div class="font-medium text-sm text-gray-600 capitalize">{{
                                                        key.replace(/_/g, ' ') }}</div>
                                                    <div class="text-sm text-gray-900">{{ value }}</div>
                                                </div>
                                            </div>
                                            <div v-else class="text-sm text-gray-500">No Trax DB Logs available.</div>
                                        </div>
                                    </div>

                                    <div v-if="currentTab === 'Shipper Pricing'">


                                        <div class="flex items-center justify-between">
                                            <!-- Title -->
                                            <SectionHeader title="Shipper Pricing Information"
                                                description="Details about the Shipper Pricing." />

                                            <!-- Refresh Button and Loader -->
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                                    @click="refreshShipperPricing(selectedRowData.id)"
                                                    :disabled="loadingRefresh">
                                                    Refresh
                                                </button>
                                                <!-- Loader Placeholder -->
                                                <div class="relative w-5 h-5">
                                                    <div v-if="loadingRefresh"
                                                        class="absolute inset-0 loader spinner-border animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Loan Type -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Loan Type</h3>
                                            <div v-if="selectedRowData.credit_engine_data.shipper_pricing?.loan_type"
                                                class="py-2">
                                                <span class="text-sm text-gray-900">{{
                                                    selectedRowData.credit_engine_data.shipper_pricing.loan_type
                                                }}</span>
                                            </div>
                                            <div v-else class="text-sm text-gray-500">No Loan Type available.</div>
                                        </div>

                                        <!-- Prices -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">Prices</h3>
                                            <div v-if="selectedRowData.credit_engine_data.shipper_pricing?.prices">
                                                <div v-for="(value, key) in selectedRowData.credit_engine_data.shipper_pricing.prices"
                                                    :key="key"
                                                    class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                                                    <div class="font-medium text-sm text-gray-600 capitalize">{{
                                                        key.replace(/_/g, ' ') }}</div>
                                                    <div class="text-sm text-gray-900">{{ value }}</div>
                                                </div>
                                            </div>
                                            <div v-else class="text-sm text-gray-500">No Prices available.</div>
                                        </div>
                                    </div>

                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>
